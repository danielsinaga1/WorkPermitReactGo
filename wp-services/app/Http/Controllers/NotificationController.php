<?php

namespace App\Http\Controllers;

use App\Models\NotificationTemplate;
use App\Models\NotificationSubscription;
use App\Models\NotificationDispatch;
use App\Services\NotificationDispatcher;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function indexTemplates()
    {
        return response()->json(['success' => true, 'data' => NotificationTemplate::all()]);
    }

    public function storeTemplate(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|unique:notification_templates',
            'name' => 'required|string',
            'event' => 'required|string',
            'channels' => 'required|array',
            'body_template' => 'required|string',
        ]);
        $template = NotificationTemplate::create($request->all());
        return response()->json(['success' => true, 'data' => $template], 201);
    }

    public function updateTemplate(Request $request, $id)
    {
        $template = NotificationTemplate::findOrFail($id);
        $template->update($request->all());
        return response()->json(['success' => true, 'data' => $template]);
    }

    // ============= SUBSCRIPTIONS =============
    public function mySubscriptions(Request $request)
    {
        $userId = $request->user()->id;
        return response()->json([
            'success' => true,
            'data' => NotificationSubscription::where('user_id', $userId)->get(),
        ]);
    }

    public function updateSubscription(Request $request)
    {
        $this->validate($request, [
            'event' => 'required|string',
            'channels' => 'required|array',
        ]);
        $userId = $request->user()->id;

        $sub = NotificationSubscription::updateOrCreate(
            ['user_id' => $userId, 'event' => $request->event],
            ['channels' => $request->channels, 'is_enabled' => $request->input('is_enabled', true)]
        );
        return response()->json(['success' => true, 'data' => $sub]);
    }

    // ============= DISPATCHES (logs) =============
    public function indexDispatches(Request $request)
    {
        $query = NotificationDispatch::query();
        if ($request->has('event')) $query->where('event', $request->event);
        if ($request->has('channel')) $query->where('channel', $request->channel);
        if ($request->has('status')) $query->where('status', $request->status);
        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(50),
        ]);
    }

    public function send(Request $request, NotificationDispatcher $dispatcher)
    {
        $this->validate($request, [
            'event' => 'required|string',
            'recipients' => 'required|array',
            'context' => 'array',
        ]);

        $dispatched = $dispatcher->dispatch(
            $request->event,
            $request->recipients,
            $request->context ?? []
        );

        return response()->json([
            'success' => true,
            'message' => count($dispatched) . ' notifications queued',
            'data' => $dispatched,
        ]);
    }

    public function retryFailed()
    {
        $failed = NotificationDispatch::where('status', 'failed')
            ->where('attempts', '<', 3)->get();
        foreach ($failed as $d) {
            $d->update(['status' => 'queued']);
        }
        return response()->json(['success' => true, 'count' => $failed->count()]);
    }
}
