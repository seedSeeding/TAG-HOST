<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use App\Models\Pattern;
use App\Models\Size;
use App\Models\Glove;
use App\Models\Notification;
use App\Models\MeasurementHistory;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\GloveHistory; 
class GloveController extends Controller
{
    

    /**
     * Update or create a Glove pattern based on the provided request data.
     *
     * @param Request $request
     * @param int|null $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateOFCreate(Request $request, $id = null)
{
    try {
        $validatedData = $request->validate([
            'pattern_number' => 'required|string',
            'name' => 'required|string',
            'category' => 'required|string',
            'brand' => 'required|string',
            'outer_material' => 'required|string',
            'lining_material' => 'required|string',
            'approval_state' => 'required|string', 
            'submit_date' => 'required|date_format:d/m/Y',
            'approval_time' => 'required|date_format:d/m/Y',
            'size' => 'required|string', 

            'palm_shell' => 'sometimes|required|array',
            'back_shell' => 'sometimes|required|array',
            'wrist' => 'sometimes|required|array',
            'palm_thumb' => 'sometimes|required|array',
            'back_thumb' => 'sometimes|required|array',
            'index_finger' => 'sometimes|required|array',
            'middle_finger' => 'sometimes|required|array',
            'ring_finger' => 'sometimes|required|array',
            'little_finger' => 'sometimes|required|array',
        ]);

        $submitDateTime = \DateTime::createFromFormat('d/m/Y', $validatedData['submit_date']);
        $approvalDateTime = \DateTime::createFromFormat('d/m/Y', $validatedData['approval_time']);
        
        if (!$submitDateTime || !$approvalDateTime) {
            return response()->json(['error' => 'Invalid date format'], 422);
        }

        $formattedSubmitDate = $submitDateTime->format('Y-m-d H:i:s');
        $formattedApprovalDate = $approvalDateTime->format('Y-m-d H:i:s');

        $pattern = Pattern::where('pattern_number', $validatedData['pattern_number'])->first();

        /**
         * If the pattern is not provided, create a new Pattern instance with the validated data.
         *
         * @param array $validatedData
         * @param Pattern|null $pattern
         * @return Pattern
         */
        if (!$pattern) {
            $pattern = Pattern::create([
                'maker_id' => 1,
                'pattern_number' => $validatedData['pattern_number'],
                'name' => $validatedData['name'],
                'category' => $validatedData['category'],
                'brand' => $validatedData['brand'],
                'outer_material' => $validatedData['outer_material'],
                'lining_material' => $validatedData['lining_material'],
            ]);
        }
        $sizeMapping = [
                'small' => 1,
                'medium' => 2,
                'large' => 3,
                'x-large' => 4,
            ];
        
          
            $sizeValue = isset($sizeMapping[$validatedData['size']]) ? $sizeMapping[$validatedData['size']] : null;
        
            /**
             * Update or create a Size model based on the provided data.
             *
             * If $sizeValue is not null, it updates or creates a Size model with the given name, pattern_id, and size_value.
             * If $sizeValue is null, it throws an Exception with a message indicating the invalid size provided.
             *
             * @param array $validatedData
             * @param mixed $sizeValue
             * @param Pattern $pattern
             * @return Size
             * @throws Exception
             */
            if ($sizeValue !== null) {
                $size = Size::updateOrCreate(
                    ['name' => $validatedData['size']],
                    ['pattern_id' => $pattern->id, 'size_value' => $sizeValue] 
                );
            } else {
                throw new Exception('Invalid size provided: ' . $validatedData['size']);
            }

        
        $glove = Glove::updateOrCreate(
            ['pattern_id' => $pattern->id, 'size_id' => $size->id],
            [
                'palm_shell' => isset($validatedData['palm_shell']) ? json_encode($validatedData['palm_shell']) : null,
                'black_shell' => isset($validatedData['back_shell']) ? json_encode($validatedData['back_shell']) : null,
                'wrist' => isset($validatedData['wrist']) ? json_encode($validatedData['wrist']) : null,
                'palm_thumb' => isset($validatedData['palm_thumb']) ? json_encode($validatedData['palm_thumb']) : null,
                'back_thumb' => isset($validatedData['back_thumb']) ? json_encode($validatedData['back_thumb']) : null,
                'index_finger' => isset($validatedData['index_finger']) ? json_encode($validatedData['index_finger']) : null,
                'middle_finger' => isset($validatedData['middle_finger']) ? json_encode($validatedData['middle_finger']) : null,
                'ring_finger' => isset($validatedData['ring_finger']) ? json_encode($validatedData['ring_finger']) : null,
                'little_finger' => isset($validatedData['little_finger']) ? json_encode($validatedData['little_finger']) : null,
                'saved' => true,
                'submitted' => true,
                'submit_date' => $formattedSubmitDate,
                'approval_state' => $validatedData['approval_state'],
                'approval_time' => $formattedApprovalDate
            ]
        );

        
        return response()->json(['message' => $glove->submitted ? "Submitted" : "Saved"], 201);

    } catch (ValidationException $e) {
        return response()->json(['error' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'An error occurred while updating the Glove pattern.'], 500);
    }
}
/**
 * Create a new glove pattern based on the provided request data.
 *
 * @param Request $request
 * @return \Illuminate\Http\JsonResponse
 */
public function createGlovePattern(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'maker_id' => 'required|exists:users,id',
            'pattern_number' => 'required|string|unique:patterns,pattern_number',
            'name' => 'required|string',
            'category' => 'required|string',
            'brand' => 'required|string',
            'size_to_save' => 'required',
            'outer_material' => 'required|string',
            'lining_material' => 'required|string',
            'submit' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',

            'sizes' => 'required|array',
            'sizes.*.name' => 'required|string',
            'sizes.*.measurements' => 'required|array',
            'sizes.*.measurements.*.length' => 'nullable|numeric',
            'sizes.*.measurements.*.width' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $imagePath = $request->file('image')->store('images', 'public');
        $validatedData['image'] = $imagePath;

        // Create the pattern
        $pattern = Pattern::create([
            'maker_id' => $validatedData['maker_id'],
            'pattern_number' => $validatedData['pattern_number'],
            'name' => $validatedData['name'],
            'brand' => $validatedData['brand'],
            'category' => $validatedData['category'],
            'outer_material' => $validatedData['outer_material'],
            'lining_material' => $validatedData['lining_material'],
            'image' => $validatedData['image'],
        ]);

        $sizeLabelMap = [1 => 'Small', 2 => 'Medium', 3 => 'Large', 4 => 'X-Large'];
        $sizeID = 1;

        foreach ($validatedData['sizes'] as $sizeData) {
            $size = Size::firstOrCreate(['name' => $sizeData['name']]);
            $save = ($sizeID === (int) $request->size_to_save);
            $submitted = ($sizeID === (int) $request->size_to_save) && filter_var($validatedData['submit'], FILTER_VALIDATE_BOOLEAN);

            $glove = Glove::create([
                'pattern_id' => $pattern->id,
                'size_id' => $size->id,
                'palm_shell' => json_encode($sizeData['measurements']['palm_shell']),
                'black_shell' => json_encode($sizeData['measurements']['black_shell']),
                'wrist' => json_encode($sizeData['measurements']['wrist']),
                'palm_thumb' => json_encode($sizeData['measurements']['palm_thumb']),
                'back_thumb' => json_encode($sizeData['measurements']['back_thumb']),
                'index_finger' => json_encode($sizeData['measurements']['index_finger']),
                'middle_finger' => json_encode($sizeData['measurements']['middle_finger']),
                'ring_finger' => json_encode($sizeData['measurements']['ring_finger']),
                'little_finger' => json_encode($sizeData['measurements']['little_finger']),
                'approval_state' => 'pending',
                'saved' => $save,
                'submitted' => $submitted,
                'submit_date' => $submitted ? now() : null,
            ]);

            if ($save) {
                MeasurementHistory::create([
                    'category' => 'gloves',
                    'size_id' => $size->id,
                    'pattern_id' => $pattern->id,
                    'data' => json_encode($glove),
                    'updated_at' => now(),
                ]);
            }

            if ($submitted) {
                Notification::create([
                    'user_id' => $pattern->maker_id,
                    'message' => "Pattern: {$pattern->pattern_number} has been submitted",
                    'size' => $sizeLabelMap[$glove->size_id] ?? 'Unknown',
                    'is_read' => false,
                ]);
            }

            $sizeID++;
        }

        return response()->json(['message' => 'Glove pattern created successfully.'], 201);

    } catch (ValidationException $e) {
        return response()->json(['error' => $e->errors(), 'message' => 'Validation failed.'], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'An error occurred whidddle creating the glove pattern.', 'message' => $e->getMessage()], 500);
    }
}
    /**
     * Retrieve all patterns with associated gloves and return a JSON response.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $patterns = Pattern::with('gloves')->get();
        return response()->json($patterns, 200);
    }

  
    /**
     * Display the specified pattern.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        /**
         * Find a pattern with the specified ID and return it as a JSON response.
         *
         * @param int $id
         * @return \Illuminate\Http\JsonResponse
         */
        $pattern = Pattern::with('gloves')->find($id);
        if (!$pattern) {
            return response()->json(['error' => 'Pattern not found.'], 404);
        }
        return response()->json($pattern, 200);
    }

    /**
     * Update a glove record based on the provided request data and ID.
     *
     * This method validates the request data, updates the glove record, creates a new glove history entry,
     * updates or creates a size record, and creates a measurement history entry. It also handles submission
     * notifications and returns a JSON response based on the operation result.
     *
     * @param Request $request The request object containing the data to update the glove
     * @param int $id The ID of the glove to update
     * @return \Illuminate\Http\JsonResponse A JSON response indicating the success or failure of the update operation
     */
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string',
                'size_to_save' => 'required',
                'id' => 'required',
                'submit' => 'required',
                'glove_id' => 'required',
    
                'palm_shell' => 'sometimes|required|array',
                'black_shell' => 'sometimes|required|array',
                'wrist' => 'sometimes|required|array',
                'palm_thumb' => 'sometimes|required|array',
                'back_thumb' => 'sometimes|required|array',
                'index_finger' => 'sometimes|required|array',
                'middle_finger' => 'sometimes|required|array',
                'ring_finger' => 'sometimes|required|array',
                'little_finger' => 'sometimes|required|array',
            ]);
    
            $glove = Glove::findOrFail($validatedData['glove_id']);
            

    
            $size = Size::updateOrCreate(
                ['name' => $validatedData['name']],
                ['pattern_id' => $validatedData['id']]
            );
    
            $saved = $size->id === $validatedData['size_to_save'];
            $submitted = $validatedData['submit'] ?? false;
            
            $submit_date = null;
            $message = "";

            if ($glove->submitted && $submitted) {
                $message = "Saved";
                $submit_date = $glove->submit_date;
            }else if($submitted){
                $message = "Submitted";
            }else{
                $message = "Saved";
            }
            /**
             * Update the glove with the provided data.
             *
             * @param array $validatedData An array of validated data to update the glove with.
             * @param bool $saved A boolean indicating if the glove is saved.
             * @param bool $submitted A boolean indicating if the glove is submitted.
             * @param \Carbon\Carbon|null $submitDate The submission date if submitted is true.
             * @return void
             */
            $glove->update([
                'pattern_id' => $validatedData['id'],
                'size_id' => $size->id,

                'palm_shell' => isset($validatedData['palm_shell']) ? json_encode($validatedData['palm_shell']) : null,
                'black_shell' => isset($validatedData['black_shell']) ? json_encode($validatedData['black_shell']) : null,
                'wrist' => isset($validatedData['wrist']) ? json_encode($validatedData['wrist']) : null,
                'palm_thumb' => isset($validatedData['palm_thumb']) ? json_encode($validatedData['palm_thumb']) : null,
                'back_thumb' => isset($validatedData['back_thumb']) ? json_encode($validatedData['back_thumb']) : null,
                'index_finger' => isset($validatedData['index_finger']) ? json_encode($validatedData['index_finger']) : null,
                'middle_finger' => isset($validatedData['middle_finger']) ? json_encode($validatedData['middle_finger']) : null,
                'ring_finger' => isset($validatedData['ring_finger']) ? json_encode($validatedData['ring_finger']) : null,
                'little_finger' => isset($validatedData['little_finger']) ? json_encode($validatedData['little_finger']) : null,

                'saved' => $saved,
                'submitted' => $submitted,
               'submit_date' => $submitted ? now() :  $submit_date,
            ]);
            /**
             * Create a new record in the MeasurementHistory table with the provided data.
             *
             * @param array $data
             * @return MeasurementHistory
             */
            MeasurementHistory::create([
                'category' => "gloves",
                'size_id' => $size->id,
                'pattern_id' => $validatedData['id'],
                'data' => json_encode($glove), 
                'updated_at' => now(),                    
            ]);

            /**
             * Create a notification and return a JSON response based on the submitted status.
             *
             * If submitted is true, create a notification for the pattern submission and return a JSON response with a success message.
             * If submitted is false, return a JSON response with a message indicating the data was saved.
             *
             * @param bool $submitted
             * @param Glove $glove
             * @return \Illuminate\Http\JsonResponse
             */
            $pattern = Pattern::find($glove->pattern_id);
            $pattern->touch();
            if ($submitted) {
              
                Notification::create([
                    'user_id' => $pattern->maker_id,
                    'message' => "Pattern: {$pattern->pattern_number} has been submitted",
                    'size' => $glove->size_id === 1 ? 'Small' : ($glove->size_id === 2 ? 'Medium' : ($glove->size_id === 3 ? 'Large' : 'X-Large')),
                    'is_read' => false,
                ]);
                return response()->json(['message' => $message], 201);
            }else{
                return response()->json(['message' => $message], 201);
            }
    
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function history($id)
{
    $histories = GloveHistory::where('glove_id', $id)->get();
    return response()->json($histories);
}
/*********************************************************************************************************************** */
/**
 * Soft delete a glove by its ID.
 *
 * @param int $id The ID of the glove to be soft deleted
 * @return \Illuminate\Http\JsonResponse A JSON response indicating the result of the operation
 */
public function softDeleteGlove($id)
    {
        $glove = Glove::find($id);

        if ($glove) {
            $glove->delete(); 
            return response()->json(['message' => 'Glove deleted successfully.'], 200);
        } else {
            return response()->json(['error' => 'Glove not found.'], 404);
        }
    }

    /**
     * Restore a soft-deleted glove by its ID.
     *
     * @param int $id The ID of the glove to restore.
     * @return \Illuminate\Http\JsonResponse A JSON response indicating the result of the restore operation.
     */
    public function restoreGlove($id)
    {
        $glove = Glove::withTrashed()->find($id);

        if ($glove) {
            $glove->restore(); 
            return response()->json(['message' => 'Glove restored successfully.'], 200);
        } else {
            return response()->json(['error' => 'Glove not found.'], 404);
        }
    }

    /**
     * Permanently delete a glove by ID, even if it is soft deleted.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function forceDeleteGlove($id)
    {
        $glove = Glove::withTrashed()->find($id);

        if ($glove) {
            $glove->forceDelete(); 
            return response()->json(['message' => 'Glove permanently deleted.'], 200);
        } else {
            return response()->json(['error' => 'Glove not found.'], 404);
        }
    }
    
    /************************************************************************************** */
    /**
     * Delete a specific pattern and its associated gloves.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $pattern = Pattern::findOrFail($id);
            $pattern->gloves()->delete();
            $pattern->delete(); 
            return response()->json(['message' => 'Pattern deleted successfully.'], 204);
        } catch (\Exception $e) {
            \Log::error('Error deleting glove pattern: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while deleting the glove pattern.'], 500);
        }
    }


    /**
     * Get patterns by the specified maker ID.
     *
     * This method retrieves patterns associated with the given maker ID.
     *
     * @param int $makerId The ID of the maker for which patterns are to be retrieved.
     * @return \Illuminate\Http\JsonResponse A JSON response containing the patterns found for the maker ID.
     */
    public function getPatternsByMakerId($makerId)
    {
      
        if (!is_numeric($makerId)) {
            return response()->json(['error' => 'Invalid maker ID.'], 400);
        }

       
        $patterns = Pattern::with('gloves')->where('maker_id', $makerId)->get();

       
        if ($patterns->isEmpty()) {
            return response()->json(['message' => 'No patterns found for this maker ID.'], 404);
        }

        return response()->json($patterns, 200);
    }
}
