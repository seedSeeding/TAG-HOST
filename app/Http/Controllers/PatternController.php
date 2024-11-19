<?php

namespace App\Http\Controllers;
use App\Models\Pattern;
use App\Models\Size;
use App\Models\Glove;
use App\Models\Hat;
use App\Models\Scarf;
use App\Models\MakerNotification;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
class PatternController extends Controller
{
    /**
     * Update the image for a pattern based on the request data.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateImage(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                "image" => 'required',
                "pattern_number" => "required",
            ]); 
            
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
    
            $validatedData = $validator->validated();
            $pattern = Pattern::where("pattern_number", $validatedData['pattern_number'])->first();
            
            if ($pattern) {
                $imagePath = $request->file('image')->store('images', 'public');
                $pattern->image = $imagePath;
                $pattern->save();
    
                return response()->json(['message' => 'Image updated successfully', 'pattern' => $pattern], 200);
            } else {
                return response()->json(['error' => 'Pattern not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
        
/*************************************************************************************************************** */    
    /**
     * Retrieve patterns with associated gloves, scarves, and hats.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPatterns(Request $request)
    {
        try {
           
            $patterns = Pattern::with('gloves', 'scarves', 'hats')
                ->orderBy('updated_at', 'desc')
                ->get();
            
            return response()->json($patterns, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    

/*************************************************************************************************************** */
   
/**
 * Get categories by maker ID.
 *
 * This method retrieves categories and pattern numbers associated with a specific maker ID.
 * If the maker ID is not numeric, it returns an error response.
 * If no patterns are found for the given maker ID, it returns a message response.
 *
 * @param int $makerId The ID of the maker
 * @return \Illuminate\Http\JsonResponse The JSON response containing categories and pattern numbers
 */
public function getCategoriesByMakerId($makerId)
{
    
    if (!is_numeric($makerId)) {
        return response()->json(['error' => 'Invalid maker ID.'], 400);
    }

    $patterns = Pattern::where('maker_id', $makerId)
        ->select('category', 'pattern_number') 
        ->get()
        ->groupBy('category'); 
   
    if ($patterns->isEmpty()) {
        return response()->json(['message' => 'No patterns found for this maker ID.'], 404);
    }

    return response()->json($patterns, 200);
}

/************************************************************************************************************************* */
/**
 * Get patterns by the maker's ID.
 *
 * This method retrieves patterns associated with a specific maker ID, including gloves, scarves, and hats.
 *
 * @param int $id The ID of the maker
 * @return \Illuminate\Http\JsonResponse JSON response containing the patterns
 */
public function getPatternsByMakerId($id)
{

try {
   
    $patterns = Pattern::with('gloves','scarves','hats')->where('maker_id',$id)->get();        
    return response()->json($patterns, 200);
} catch (\Exception $e) {
    \Log::error('Error fetching glove patterns: ' . $e->getMessage());
    return response()->json(['error' => 'An error occurred while processing your request.'], 500);
}

}
/*************************************************************************************************************************** */
/**
 * Approve the size of a pattern based on the provided request data.
 *
 * @param Request $request
 * @return \Illuminate\Http\JsonResponse
 */
public function approvePatternSize(Request $request)
{
   
    $request->validate([
        'pattern_number' => 'required|string',
        'size_id' => 'required|integer',
        'approval_state' => 'required|string|in:approved,pending,revision,dropped',
    ]);

    try {
       
        $pattern = Pattern::with(['gloves', 'scarves', 'hats'])
            ->where('pattern_number', $request->pattern_number)
            ->firstOrFail();

        
        $sizeData = null;


        foreach ($pattern->gloves as $glove) {
            if ($glove->size_id == $request->size_id) {
                $sizeData = $glove;
                break;
            }
        }

        if (!$sizeData) {
            foreach ($pattern->hats as $hat) {
                if ($hat->size_id == $request->size_id) {
                    $sizeData = $hat;
                    break;
                }
            }
        }

        if (!$sizeData) {
            foreach ($pattern->scarves as $scarf) {
                if ($scarf->size_id == $request->size_id) {
                    $sizeData = $scarf;
                    break;
                }
            }
        }

       
        if ($sizeData) {
            $sizeData->approval_state = $request->approval_state;

            
            if ($request->approval_state === 'approved') {
                $sizeData->approval_time = now(); 
            } else {
                $sizeData->approval_time = null; 
            }

            $sizeData->save();

            return response()->json([
                'message' => 'Approval state updated successfully.',
                'size' => $sizeData,
            ], 200);
        } else {
            return response()->json(['error' => 'Size not found in the pattern.'], 404);
        }
    } catch (\Exception $e) {
        \Log::error('Error approving pattern size: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred while processing your request.'], 500);
    }
}
/********************************************************************************************************************** */
public function updateBrandName(Request $request, $id)
{
    try {
        $request->validate([
            'brand' => 'required|string',
        ]);

        $pattern = Pattern::find($id);

        if (!$pattern) {
            return response()->json(['error' => 'Pattern not found.'], 404);
        }

        $pattern->brand = $request->brand;
        $pattern->save();

        return response()->json(['message' => 'Brand updated successfully.'], 200);
    } catch (\Exception $e) {
        \Log::error('Error updating brand name: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred while processing your request.'], 500);
    }
}

/********************************************************************************************************************** */
public function changeState(Request $request)
{
  
    $validator = Validator::make($request->all(), [
        'pattern_number' => 'required|string',
        'evaluated_by' => 'required|string',
        'size_id' => 'required|integer',
        'approval_state' => 'required|string|in:approved,revision,dropped',
        'reason' => 'nullable|string',
        'user_id' => 'required|integer',
        'pattern_id' => 'required|integer'
    ]);
    
    if ($validator->fails()) {
        return response()->json([
            'errors' => $validator->errors()
        ], 422);
    }
  

    try {
     
        $pattern = Pattern::with(['gloves', 'scarves', 'hats'])
            ->where('pattern_number', $request->pattern_number)
            ->firstOrFail();
        
        $sizeData = null;

      
        foreach ($pattern->gloves as $glove) {
            if ($glove->size_id == $request->size_id) {
                $sizeData = $glove;
                break;
            }
        }

        if (!$sizeData) {
            foreach ($pattern->hats as $hat) {
                if ($hat->size_id == $request->size_id) {
                    $sizeData = $hat;
                    break;
                }
            }
        }

        if (!$sizeData) {
            foreach ($pattern->scarves as $scarf) {
                if ($scarf->size_id == $request->size_id) {
                    $sizeData = $scarf;
                    break;
                }
            }
        }

       
        if ($sizeData) {
          
            $sizeData->approval_state = $request->approval_state;

          
            if ($request->approval_state === 'approved') {
                $sizeData->approval_time = now(); 
                $sizeData->reason = null; 
            } elseif ($request->approval_state === 'revision') {

                $sizeData->reason =  $request->reason; 
                $sizeData->approval_time = null;
            } else {
               
                $sizeData->approval_time = null;
                $sizeData->reason = null; 
            }
            MakerNotification::create([
                'user_id' => $request->user_id,     
                'pattern_id' => $request->pattern_id,           
                'message' => "Pattern: {$pattern->pattern_number}  has been evaluated",
                'is_read' => false,
            ]);
            $pattern->evaluated_by = $request->evaluated_by;
            $pattern->save();
            $sizeData->save(); 
            return response()->json([
                'message' => 'Evaluation Status updated successfully.',
                'size' => $sizeData,
            ], 200);
        } else {
            return response()->json(['error' => 'Size not found in the pattern.'], 404);
        }
    } catch (\Exception $e) {
        \Log::error('Error approving pattern size: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred while processing your request.'], 500);
    }
}
public function submitRecord($patternID)
{
   
    if (!is_numeric($patternID) || !$pattern = Pattern::find($patternID)) {
        return response()->json(['error' => 'Invalid pattern ID.'], 404);
    }

   
    if ($pattern->submitted) {
        return response()->json(['error' => 'Pattern has already been submitted.'], 400);
    }
  
    $pattern->submitted = true;
    $pattern->save();

    return response()->json(['message' => 'Pattern submitted successfully.'], 201);
}

}
