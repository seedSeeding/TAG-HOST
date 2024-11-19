<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    PatternController,
    GloveController,
    HatController,
    ScarfController,
    SizeController,
    AuthController,
    NotificationController,
    MakerNotificationsController,
    PatternDataController,
    MeasurementHistoryController
};

// CSRF Token Routes
Route::get('/token', function () {
    return csrf_token();
});


Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());

    // Admin User Management
    Route::apiResource('users', AuthController::class);
    Route::post("/update-user",[AuthController::class,"update_user"]);
    // Glove Routes
    Route::prefix('gloves')->group(function () {
       // Create a new glove pattern
    Route::post('/', [GloveController::class, 'createGlovePattern']);

    // Get all glove patterns
    Route::get('/', [GloveController::class, 'index']);

    // Get a specific glove pattern by its ID
    Route::get('/{id}', [GloveController::class, 'show']);

    // Update a specific glove pattern by its ID
    Route::put('/{id}', [GloveController::class, 'update']);

    // Delete a specific glove pattern by its ID
    Route::delete('/{id}', [GloveController::class, 'destroy']);

    // Soft delete a specific glove pattern by its ID (mark as deleted without removing from the database)
    Route::delete('/delete/{id}', [GloveController::class, 'softDeleteGlove']);

    // Get glove patterns by a specific maker's ID
    Route::get('/maker/{makerId}', [GloveController::class, 'getPatternsByMakerId']);

    // Get history of a specific glove pattern by its ID
    Route::get('/{id}/history', [GloveController::class, 'history']);

    // Update or create a new glove pattern
    Route::post('/update-create', [GloveController::class, 'updateOFCreate']);


    });

    // Scarf Routes
    Route::prefix('scarves')->group(function () {
       // Create a new scarf pattern
        Route::post('/', [ScarfController::class, 'createScarfPattern']);

        // Get all scarf patterns
        Route::get('/', [ScarfController::class, 'index']);

        // Get a specific scarf pattern by its ID
        Route::get('/{id}', [ScarfController::class, 'show']);

        // Update a specific scarf pattern by its ID
        Route::put('/{id}', [ScarfController::class, 'update']);

        // Delete a specific scarf pattern by its ID
        Route::delete('/{id}', [ScarfController::class, 'destroy']);

        // Get scarf patterns by a specific maker's ID
        Route::get('/maker/{makerId}', [ScarfController::class, 'getPatternsByMakerId']);

        // Update or create a new scarf pattern
        Route::post('/update-create', [ScarfController::class, 'updateOrCreate']);

    });

    // Hat Routes
    Route::prefix('hats')->group(function () {
      // Create a new hat pattern
    Route::post('/', [HatController::class, 'createHatPattern']);

    // Get all hat patterns
    Route::get('/', [HatController::class, 'index']);

    // Get a specific hat pattern by its ID
    Route::get('/{id}', [HatController::class, 'show']);

    // Update a specific hat pattern by its ID
    Route::put('/{id}', [HatController::class, 'update']);

    // Delete a specific hat pattern by its ID
    Route::delete('/{id}', [HatController::class, 'destroy']);

    // Get hat patterns by a specific maker's ID
    Route::get('/maker/{makerId}', [HatController::class, 'getPatternsByMakerId']);

    // Update or create a new hat pattern
    Route::post('/update-create', [HatController::class, 'updateOrCreate']);    

    });

    // Pattern Routes
    Route::prefix('patterns')->group(function () {
       // Get all patterns
        Route::get('/get-all', [PatternController::class, 'getPatterns']);

        // Get patterns by a specific maker's ID
        Route::get('/maker/{makerId}', [PatternController::class, 'getPatternsByMakerId']);

        // Approve a specific pattern size
        Route::post('/approve-pattern', [PatternController::class, 'approvePatternSize']);

        // Change the state of a specific pattern
        Route::post('/change-state', [PatternController::class, 'changeState']);

        // Submit a specific pattern record by its ID
        Route::put('/submit/{patternID}', [PatternController::class, 'submitRecord']);

        // Update the image for a specific pattern
        Route::post('/update-image', [PatternController::class, 'updateImage']);

        // Update the brand name of a specific pattern by its ID
        Route::put('/update-brand-name/{id}', [PatternController::class, 'updateBrandName']);

    });

    // Data and Analysis Routes
    Route::prefix('data')->group(function () {
       // Get total states by brand and size
        Route::get('/get-total-states', [PatternDataController::class, 'getStateTotalByBrandSize']);

        // Get all pattern data records
        Route::get('/get-total-records', [PatternDataController::class, 'getAllData']);

        // Get the time taken for approval of patterns
        Route::get('/get-time-to-approval', [PatternDataController::class, 'getTimeToApproval']);

        // Get fit issues related to patterns
        Route::get('/get-fit-issues', [PatternDataController::class, 'getFitIssuesByPattern']);

        // Get the list of available brands
        Route::get('/get-brand-list', [PatternDataController::class, 'getBrandList']);

        // Get popularity of materials used in patterns
        Route::get('/material-popularity', [PatternDataController::class, 'getMaterialPopularity']);

        // Get total statistics across all companies
        Route::get('/get-all-total', [PatternDataController::class, 'getTotalsOfCompanies']);

        // Get issue analysis related to patterns
        Route::get('/get-analysis', [PatternDataController::class, 'getIssueAnalysis']);

        // Get adjustment accuracy data for patterns
        Route::get('/get-adjustment-accuracy', [PatternDataController::class, 'getAdjustmentAccuracy']);

        // Get all pattern data records (alternative route to '/get-total-records')
        Route::get('/get-all-data', [PatternDataController::class, 'get_total_records']);

        // Get all records from pattern data
        Route::get('/get-all-records', [PatternDataController::class, 'getAllData']);

        // Get measurements of pattern parts
        Route::get('/get-parts-measurements', [PatternDataController::class, 'getAdjusmentsByPattern']);

        // Get adjustment accuracy for patterns (alternative route)
        Route::get('/get-adjusment-acc', [PatternDataController::class, 'getAdjusmentAcuuracy']);





    });

    // Notification Routes
    Route::get('/notifications', [NotificationController::class, 'getAllNotifications']); //
    Route::get('/notifications/user/{userId}', [NotificationController::class, 'getNotificationsByUserId']); //
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']); //
    Route::get('/maker_notifications', [MakerNotificationsController::class, 'getAllNotifications']); //
    Route::get('/maker_notifications/user/{userId}', [MakerNotificationsController::class, 'getNotificationsByUserId']); //
    Route::post('/maker_notifications/mark-all/{user_id}', [MakerNotificationsController::class, 'markAllAsRead']); //

    // Measurement History Routes
    Route::get('/get-history', [MeasurementHistoryController::class, 'getHistory']); //
});
