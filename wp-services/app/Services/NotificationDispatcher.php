<?php

namespace App\Services;

use App\Models\NotificationTemplate;
use App\Models\NotificationDispatch;
use App\Models\NotificationSubscription;

class NotificationDispatcher
{
    public function dispatch(string $event, array $recipients, array $context = []): array
    {
        $template = NotificationTemplate::forEvent($event);
        if (!$template) return [];

        $dispatched = [];
        foreach ($recipients as $recipient) {
            $userId = is_array($recipient) ? ($recipient['user_id'] ?? null) : null;
            $channels = $template->channels;

            if ($userId) {
                $sub = NotificationSubscription::where('user_id', $userId)
                    ->where('event', $event)->first();
                if ($sub && $sub->is_enabled) {
                    $channels = $sub->channels;
                }
            }

            foreach ($channels as $channel) {
                $address = $this->resolveAddress($recipient, $channel);
                if (!$address) continue;

                $body = $this->renderTemplate($template->body_template, $context);
                $subject = $template->subject_template
                    ? $this->renderTemplate($template->subject_template, $context)
                    : null;

                $dispatched[] = NotificationDispatch::create([
                    'event' => $event,
                    'channel' => $channel,
                    'recipient' => $address,
                    'recipient_user_id' => $userId,
                    'subject' => $subject,
                    'body' => $body,
                    'status' => 'queued',
                ]);
            }
        }

        return $dispatched;
    }

    public function processQueue(int $batch = 50): int
    {
        $pending = NotificationDispatch::pending()->limit($batch)->get();
        $sent = 0;

        foreach ($pending as $dispatch) {
            try {
                $this->sendVia($dispatch);
                $dispatch->update([
                    'status' => 'sent',
                    'sent_at' => now(),
                    'attempts' => $dispatch->attempts + 1,
                ]);
                $sent++;
            } catch (\Throwable $e) {
                $dispatch->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                    'attempts' => $dispatch->attempts + 1,
                ]);
            }
        }
        return $sent;
    }

    private function sendVia(NotificationDispatch $dispatch): void
    {
        match ($dispatch->channel) {
            'email' => $this->sendEmail($dispatch),
            'sms' => $this->sendSms($dispatch),
            'whatsapp' => $this->sendWhatsapp($dispatch),
            'push' => $this->sendPush($dispatch),
            'in_app' => null,
            default => throw new \RuntimeException("Unsupported channel: {$dispatch->channel}"),
        };
    }

    private function sendEmail(NotificationDispatch $d): void
    {
        // hook to actual mail driver - placeholder
        @mail($d->recipient, $d->subject ?? '(no subject)', $d->body);
    }

    private function sendSms(NotificationDispatch $d): void
    {
        // integrate with provider (Twilio, etc.) here
    }

    private function sendWhatsapp(NotificationDispatch $d): void
    {
        // integrate with WA Business API here
    }

    private function sendPush(NotificationDispatch $d): void
    {
        // integrate with FCM/APN here
    }

    private function resolveAddress($recipient, string $channel): ?string
    {
        if (is_string($recipient)) return $recipient;
        if (!is_array($recipient)) return null;
        return match ($channel) {
            'email' => $recipient['email'] ?? null,
            'sms', 'whatsapp' => $recipient['phone'] ?? null,
            'push' => $recipient['device_token'] ?? null,
            'in_app' => (string)($recipient['user_id'] ?? ''),
            default => null,
        };
    }

    private function renderTemplate(string $tpl, array $vars): string
    {
        return preg_replace_callback('/\{\{\s*(\w+)\s*\}\}/', function ($m) use ($vars) {
            return $vars[$m[1]] ?? '';
        }, $tpl);
    }
}
