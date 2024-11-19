<?php

namespace App\Http\Controllers;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;
class NotificationController extends Controller
{
    /**
     * Retrieve all notifications with associated user and pattern, sorted by creation date in descending order.
     * Each notification's creation time is converted to a human-readable format.
     * The user's image is included in the notification if available.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllNotifications()
{
    try {
        $notifications = Notification::with('user','pattern') 
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                $notification->time_ago = Carbon::parse($notification->created_at)->diffForHumans();

                
                $notification->user_image = $notification->user->image ?? null;

                return $notification;
            });

        return response()->json($notifications);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch notifications', 'message' => $e->getMessage()], 500);
    }
}


    /**
     * Get notifications for a specific user by user ID.
     *
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNotificationsByUserId($userId)
    {
        try {
            $notifications = Notification::where('user_id', $userId)->get()->map(function ($notification) {

                $notification->time_ago = Carbon::parse($notification->created_at)->diffForHumans();
                return $notification;
            });

            return response()->json($notifications);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch notifications', 'message' => $e->getMessage()], 500);
        }
    }


    /**
     * Marks all unread notifications as read.
     *
     * This method retrieves all unread notifications from the database, marks them as read,
     * and saves the changes. If no unread notifications are found, it returns a JSON response
     * with a message indicating that no unread notifications were found. If an error occurs during
     * the process, it catches the exception and returns a JSON response with an error message.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAllAsRead()
{
    try {

        $notifications = Notification::where('is_read', false)->get();


        if ($notifications->isEmpty()) {
            return response()->json(['message' => 'No unread notifications found']);
        }


        foreach ($notifications as $notification) {
            $notification->is_read = true;
            $notification->save();
        }

        return response()->json(['message' => 'All notifications marked as read']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to mark notifications as read', 'message' => $e->getMessage()], 500);
    }
}


}
