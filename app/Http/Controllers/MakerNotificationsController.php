<?php

namespace App\Http\Controllers;
use App\Models\MakerNotification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MakerNotificationsController extends Controller
{
    /**
     * Retrieve all notifications with associated user information and return them as JSON response.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllNotifications()
    {
        try {
            $notifications = MakerNotification::with('user') 
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
                $notifications = MakerNotification::with('pattern')->where('user_id', $userId)->get()->map(function ($notification) {
    
                    $notification->time_ago = Carbon::parse($notification->created_at)->diffForHumans();
                    return $notification;
                });
    
                return response()->json($notifications);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to fetch notifications', 'message' => $e->getMessage()], 500);
            }
        }
    
    
        /**
         * Marks all unread notifications for a specific user as read.
         *
         * @param int $userId
         * @return \Illuminate\Http\JsonResponse
         */
        public function markAllAsRead($userId)
{
    try {
        
        $notifications = MakerNotification::where('user_id', $userId)
            ->where('is_read', false)
            ->get();

        if ($notifications->isEmpty()) {
            return response()->json(['message' => 'No unread notifications found']);
        }

        
        foreach ($notifications as $notification) {
            $notification->is_read = true;
            $notification->save();
        }

        return response()->json(['message' => 'All notifications marked as read for the user']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to mark notifications as read', 'message' => $e->getMessage()], 500);
    }
}

    }
    
    

