<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;
use App\Models\MeasurementHistory;
class MeasurementHistoryController extends Controller
{



/**
 * Get the measurement history based on the provided request parameters.
 *
 * @param Request $request
 * @return \Illuminate\Http\JsonResponse
 */
public function getHistory(Request $request)
{
    try {
     
        $validator = Validator::make($request->all(), [
            'category' => 'required|string',
            'size_id' => 'required|integer',
            'pattern_id' => 'required|integer|exists:patterns,id', 
        ]);

       
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation Error',
                'errors' => $validator->errors() // 
            ], 422);
        }

       
        $history = MeasurementHistory::where('category', $request->category)
            ->where('size_id', $request->size_id)
            ->where('pattern_id', $request->pattern_id)
            ->orderBy('created_at', 'desc') 
            ->get();


        return response()->json([
            'status' => 'success',
            'data' => $history
        ], 200);

    } catch (\Exception $e) {
        
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
}

}
