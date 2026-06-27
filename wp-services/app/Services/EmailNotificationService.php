<?php

namespace App\Services;

use App\Models\EmailNotification;
use App\Models\Notification;

class EmailNotificationService
{
    /**
     * Queue an email for sending.
     */
    public function queueEmail(
        string $template,
        string $recipientEmail,
        string $recipientName,
        string $subject,
        array $templateData = []
    ): ?EmailNotification {
        if (empty($recipientEmail)) return null;

        return EmailNotification::create([
            'recipient_email' => $recipientEmail,
            'recipient_name'  => $recipientName,
            'subject'         => $subject,
            'body'            => $this->renderTemplate($template, $templateData),
            'template'        => $template,
            'template_data'   => $templateData,
            'status'          => 'queued',
        ]);
    }

    /**
     * Process queued emails (called by scheduler or artisan command).
     */
    public function processQueue(int $limit = 50): array
    {
        $queued = EmailNotification::queued()->take($limit)->get();
        $results = ['sent' => 0, 'failed' => 0];

        foreach ($queued as $email) {
            try {
                $this->sendMail($email);
                $email->update(['status' => 'sent', 'sent_at' => now()]);
                $results['sent']++;
            } catch (\Exception $e) {
                $email->update([
                    'status'        => 'failed',
                    'error_message' => $e->getMessage(),
                ]);
                $results['failed']++;
            }
        }

        return $results;
    }

    /**
     * Send a single email using PHP's mail() as a lightweight approach.
     * In production, replace with a proper mail driver (SMTP, Mailgun, etc.).
     */
    protected function sendMail(EmailNotification $email): void
    {
        $smtpHost = env('MAIL_HOST');
        if (empty($smtpHost) || $smtpHost === 'null') {
            // No SMTP configured — log only (development mode)
            $email->update(['status' => 'sent', 'sent_at' => now()]);
            return;
        }

        $headers = [
            'From'         => env('MAIL_FROM_ADDRESS', 'noreply@wp-hse.com'),
            'Reply-To'     => env('MAIL_FROM_ADDRESS', 'noreply@wp-hse.com'),
            'Content-Type' => 'text/html; charset=UTF-8',
            'X-Mailer'     => 'WP-HSE/1.0',
        ];

        $headerString = '';
        foreach ($headers as $key => $value) {
            $headerString .= "{$key}: {$value}\r\n";
        }

        $sent = mail(
            $email->recipient_email,
            $email->subject,
            $email->body,
            $headerString
        );

        if (!$sent) {
            throw new \RuntimeException('Failed to send email via mail()');
        }
    }

    /**
     * Render an email body from template name and data.
     */
    protected function renderTemplate(string $template, array $data): string
    {
        $appName = env('APP_NAME', 'WP-HSE System');

        switch ($template) {
            case 'permit_approval':
                $permit = $data['permit'] ?? [];
                return $this->wrapHtml("
                    <h2>Permit Approval Requested</h2>
                    <p>A work permit requires your approval:</p>
                    <table>
                        <tr><td><strong>Permit:</strong></td><td>{$permit['permit_number']}</td></tr>
                        <tr><td><strong>Title:</strong></td><td>{$permit['title']}</td></tr>
                        <tr><td><strong>Priority:</strong></td><td>{$permit['priority']}</td></tr>
                    </table>
                    <p>Please login to the system to review and approve.</p>
                ");

            case 'sos_alert':
                $alert = $data['alert'] ?? [];
                return $this->wrapHtml("
                    <h2 style='color: #dc3545;'>⚠️ EMERGENCY SOS ALERT</h2>
                    <p>An SOS alert has been triggered:</p>
                    <table>
                        <tr><td><strong>Triggered by:</strong></td><td>{$alert['triggered_by_name']}</td></tr>
                        <tr><td><strong>Type:</strong></td><td>{$alert['alert_type']}</td></tr>
                        <tr><td><strong>Time:</strong></td><td>{$alert['triggered_at']}</td></tr>
                    </table>
                    <p><strong>Immediate response required!</strong></p>
                ");

            case 'gas_test_unsafe':
                $test = $data['test'] ?? [];
                return $this->wrapHtml("
                    <h2 style='color: #dc3545;'>⚠️ Unsafe Gas Test Reading</h2>
                    <p>An unsafe atmospheric reading has been recorded:</p>
                    <table>
                        <tr><td><strong>O₂:</strong></td><td>{$test['o2_level']}%</td></tr>
                        <tr><td><strong>LEL:</strong></td><td>{$test['lel_level']}%</td></tr>
                        <tr><td><strong>H₂S:</strong></td><td>{$test['h2s_level']} ppm</td></tr>
                        <tr><td><strong>CO:</strong></td><td>{$test['co_level']} ppm</td></tr>
                    </table>
                    <p>Take immediate corrective action.</p>
                ");

            case 'permit_expiring':
                $permit = $data['permit'] ?? [];
                return $this->wrapHtml("
                    <h2 style='color: #ffc107;'>Permit Expiring Soon</h2>
                    <p>Work permit <strong>{$permit['permit_number']}</strong> is expiring soon.</p>
                    <p>Planned end: {$permit['planned_end']}</p>
                    <p>Please extend or close the permit.</p>
                ");

            case 'permit_transfer':
                $permit = $data['permit'] ?? [];
                $transfer = $data['transfer'] ?? [];
                return $this->wrapHtml("
                    <h2>Permit Transfer Request</h2>
                    <p>A permit transfer has been requested:</p>
                    <table>
                        <tr><td><strong>Permit:</strong></td><td>{$permit['permit_number']}</td></tr>
                        <tr><td><strong>Reason:</strong></td><td>{$transfer['reason']}</td></tr>
                    </table>
                    <p>Please review and approve/reject this transfer.</p>
                ");

            case 'permit_revoked':
                $permit = $data['permit'] ?? [];
                $reason = $data['reason'] ?? '';
                return $this->wrapHtml("
                    <h2 style='color: #dc3545;'>Permit Revoked</h2>
                    <p>Your work permit has been revoked:</p>
                    <table>
                        <tr><td><strong>Permit:</strong></td><td>{$permit['permit_number']}</td></tr>
                        <tr><td><strong>Reason:</strong></td><td>{$reason}</td></tr>
                    </table>
                    <p>All work under this permit must cease immediately.</p>
                ");

            default:
                return $this->wrapHtml("<p>" . ($data['message'] ?? 'Notification from WP-HSE System') . "</p>");
        }
    }

    /**
     * Wrap content in a basic HTML email template.
     */
    protected function wrapHtml(string $content): string
    {
        $appName = env('APP_NAME', 'WP-HSE System');
        return "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;'>
            <div style='background:#f8f9fa;border-radius:8px;padding:20px;margin-bottom:20px;'>
                <h1 style='color:#1976d2;margin:0;font-size:20px;'>{$appName}</h1>
            </div>
            <div style='padding:0 10px;'>{$content}</div>
            <hr style='margin-top:30px;border:none;border-top:1px solid #dee2e6;'>
            <p style='color:#6c757d;font-size:12px;'>This is an automated email from {$appName}. Do not reply.</p>
        </body></html>";
    }

    /**
     * Helper: Create an in-app notification AND queue email.
     */
    public function notifyWithEmail(
        string $template,
        string $title,
        string $body,
        string $recipientEmail,
        string $recipientName,
        ?int $personnelId = null,
        ?string $userId = null,
        array $extraData = []
    ): void {
        // Create in-app notification
        Notification::create([
            'type'         => $template,
            'title'        => $title,
            'body'         => $body,
            'channel'      => 'in_app',
            'personnel_id' => $personnelId,
            'user_id'      => $userId,
            'data'         => $extraData,
        ]);

        // Also create push notification
        Notification::create([
            'type'         => $template,
            'title'        => $title,
            'body'         => $body,
            'channel'      => 'push',
            'personnel_id' => $personnelId,
            'user_id'      => $userId,
            'data'         => $extraData,
        ]);

        // Queue email
        $this->queueEmail($template, $recipientEmail, $recipientName, $title, $extraData);
    }
}
