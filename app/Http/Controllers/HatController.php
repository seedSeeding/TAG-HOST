<?php

namespace App\Http\Controllers;

use App\Models\Pattern;
use App\Models\Size;
use App\Models\Hat;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\MeasurementHistory;

use App\Models\Notification;
class HatController extends Controller
{
    
    /**
     * Update or create a hat pattern based on the provided request data.
     *
     * @param Request $request
     * @param int|null $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateOrCreate(Request $request, $id = null)
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

            'strap' => 'sometimes|required|array',
            'body_crown' => 'sometimes|required|array',
            'crown' => 'sometimes|required|array',
            'brim' => 'sometimes|required|array',
            'bill' => 'sometimes|required|array',
        ]);

        /**
         * Process and store hat information based on validated data.
         *
         * This function takes validated data, creates and formats DateTime objects, validates and processes size information,
         * creates or updates patterns and sizes, and finally creates a new hat entry with the provided data.
         *
         */
        $submitDateTime = \DateTime::createFromFormat('d/m/Y', $validatedData['submit_date']);
        $approvalDateTime = \DateTime::createFromFormat('d/m/Y', $validatedData['approval_time']);

        if (!$submitDateTime || !$approvalDateTime) {
            return response()->json(['error' => 'Invalid date format'], 422);
        }

        $formattedSubmitDate = $submitDateTime->format('Y-m-d H:i:s');
        $formattedApprovalDate = $approvalDateTime->format('Y-m-d H:i:s');

    
        $pattern = Pattern::firstOrCreate(
            ['pattern_number' => $validatedData['pattern_number']],
            [
                'maker_id' => 1,
                'name' => $validatedData['name'],
                'category' => $validatedData['category'],
                'brand' => $validatedData['brand'],
                'outer_material' => $validatedData['outer_material'],
                'lining_material' => $validatedData['lining_material'],
            ]
        );

        
        $sizeMapping = [
            'small' => 1,
            'medium' => 2,
            'large' => 3,
            'x-large' => 4,
        ];
    
      
        $sizeValue = isset($sizeMapping[$validatedData['size']]) ? $sizeMapping[$validatedData['size']] : null;
    
        if ($sizeValue !== null) {
            $size = Size::updateOrCreate(
                ['name' => $validatedData['size']],
                ['pattern_id' => $pattern->id, 'size_value' => $sizeValue] 
            );
        } else {
            throw new Exception('Invalid size provided: ' . $validatedData['size']);
        }

    
        $hat = Hat::updateOrCreate(
            ['pattern_id' => $pattern->id, 'size_id' => $size->id],
            [
                'strap' => isset($validatedData['strap']) ? json_encode($validatedData['strap']) : null,
                'body_crown' => isset($validatedData['body_crown']) ? json_encode($validatedData['body_crown']) : null,
                'crown' => isset($validatedData['crown']) ? json_encode($validatedData['crown']) : null,
                'brim' => isset($validatedData['brim']) ? json_encode($validatedData['brim']) : null,
                'bill' => isset($validatedData['bill']) ? json_encode($validatedData['bill']) : null,
                'saved' => true,
                'submitted' => true,
                'submit_date' => $formattedSubmitDate,
                'approval_state' => $validatedData['approval_state'],
                'approval_time' => $formattedApprovalDate,
            ]
        );

        return response()->json(['message' => $hat->submitted ? "Submitted" : "Saved"], 201);

    }catch (ValidationException $e) {
        return response()->json(['error' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'An error occurred while updating the hats pattern.'], 500);
    }
}

    /**
     * Create a new hat pattern based on the provided request data.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createHatPattern(Request $request)
    {
        try {
           
            $validator =  Validator::make($request->all(), [
                'maker_id' => 'required|exists:users,id',
                'pattern_number' => 'required|string|unique:patterns,pattern_number',
                'name' => 'required|string',
                'category' => 'required|string',
                'brand' => 'required|string',
                'size_to_save' => 'required',
                'outer_material' => 'required|string',
                'lining_material' => 'required|string',
                'submit' => 'nullable',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 

            
                'sizes' => 'required|array',
                'sizes.*.name' => 'required|string',
                'sizes.*.measurements' => 'required|array',
            
             
                'sizes.*.measurements.strap.height' => 'nullable|numeric',
                'sizes.*.measurements.strap.width' => 'nullable|numeric',
            
              
                'sizes.*.measurements.body_crown.height' => 'nullable|numeric',
                'sizes.*.measurements.body_crown.width' => 'nullable|numeric',
            
               
                'sizes.*.measurements.crown.circumference' => 'nullable|numeric',
                'sizes.*.measurements.crown.diameter' => 'nullable|numeric',
            
               
                'sizes.*.measurements.brim.circumference' => 'nullable|numeric',
                'sizes.*.measurements.brim.diameter' => 'nullable|numeric',
            
               
                'sizes.*.measurements.bill.length' => 'nullable|numeric',
                'sizes.*.measurements.bill.width' => 'nullable|numeric',
            ]);
            

          if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }
            
    
            $validatedData = $validator->validated();

            $imagePath = $request->file('image')->store('images', 'public');
            $validatedData['image'] = $imagePath;

            $pattern = Pattern::create([
                'maker_id' => $validatedData['maker_id'],
                'pattern_number' => $validatedData['pattern_number'],
                'name' => $validatedData['name'],
                'category' => $validatedData['category'],
                'brand' => $validatedData['brand'],
                'outer_material' => $validatedData['outer_material'],
                'lining_material' => $validatedData['lining_material'],
                'image' => $validatedData['image'],
            ]);
            $sizeID = 1;
           
            foreach ($validatedData['sizes'] as $sizeData) {
              
                $size = Size::firstOrCreate(['name' => $sizeData['name']]);
                $save = ($sizeID === (int) $request->size_to_save);
                $submitted = ($sizeID === (int) $request->size_to_save) && filter_var($validatedData['submit'], FILTER_VALIDATE_BOOLEAN);
              

               
                $hat = Hat::create([
                    'pattern_id' => $pattern->id,
                    'size_id' => $size->id,
                    'strap' => json_encode($sizeData['measurements']['strap']),
                    'body_crown' => json_encode($sizeData['measurements']['body_crown']),
                    'crown' => json_encode($sizeData['measurements']['crown']),
                    'brim' => json_encode($sizeData['measurements']['brim']),
                    'bill' => json_encode($sizeData['measurements']['bill']),
                    'approval_state' => 'pending',
                    'saved' => $save,
                    'submitted' => $submitted,
                    'submit_date' => $submitted ? now() : null,
                ]);
               if($save){
                MeasurementHistory::create([
                    'category' => "hats",
                    'size_id' => $size->id,
                    'pattern_id' => $pattern->id,
                    'data' => json_encode($hat), 
                    'updated_at' => now(),                    
                ]);
               }
    
                if($submitted){

                    Notification::create([
                        'user_id' => $pattern->maker_id,
                        'message' => "Pattern: {$pattern->pattern_number} has been submitted",
                        'size' => $hat->size_id === 1 ? 'Small' : ($hat->size_id === 2 ? 'Medium' : ($hat->size_id === 3 ? 'Large' : 'X-Large')),
                        'is_read' => false,
                    ]);
                }
                $sizeID++;
            }

            return response()->json([
                'message' => 'Hat pattern created successfully.',
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors(), 'message' => 'Validation failed.'], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the hat pattern.', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Retrieve all hats with their associated pattern and size information and return a JSON response.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
      
        $hats = Hat::with('pattern', 'size')->get();
        return response()->json($hats, 200);
    }

    /**
     * Display the specified hat.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
       
        $hat = Hat::with('pattern', 'size')->find($id);
        if (!$hat) {
            return response()->json(['error' => 'Hat not found'], 404);
        }
        return response()->json($hat, 200);
    }

    /**
     * Update the hat pattern details based on the provided request data.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
           
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string',
                'size_to_save' => 'required',
                'id' => 'required',
                'submit' => 'nullable',
                'hat_id' => 'required',

                'strap' => 'sometimes|required|array',
                'body_crown' => 'sometimes|required|array',
                'crown' => 'sometimes|required|array',
                'brim' => 'sometimes|required|array',
                'bill' => 'sometimes|required|array',
              
            ]);

          
            $size = Size::updateOrCreate(
                ['name' => $validatedData['name']],
                ['pattern_id' => $validatedData['id']]
            );
    
            $saved = $size->id === $validatedData['size_to_save'];
            $submitted = $validatedData['submit'] ?? false;
            $submit_date = null;
            $message = "";
            $hat = Hat::findOrFail($validatedData['hat_id']);
  
            if ($hat->submitted && $submitted) {
                $message = "Saved";
                $submit_date = $hat->submit_date;
            }else if($submitted){
                $message = "Submitted";
            }else{
                $message = "Saved";
            }
            
            $hat = $hat ? $hat : new Hat(); 
            
            $hat->update([
                'pattern_id' => $validatedData['id'],
                'size_id' => $size->id,
                
                'strap' => isset($validatedData['strap']) ? json_encode($validatedData['strap']) : null,
                'body_crown' => isset($validatedData['body_crown']) ? json_encode($validatedData['body_crown']) : null,
                'crown' => isset($validatedData['crown']) ? json_encode($validatedData['crown']) : null,
                'brim' => isset($validatedData['brim']) ? json_encode($validatedData['brim']) : null,
                'bill' => isset($validatedData['bill']) ? json_encode($validatedData['bill']) : null,
                'saved' => $saved,
                'submitted' => $submitted,
                'submit_date' => $submitted ? now() :  $submit_date,
            ]);
  
            MeasurementHistory::create([
                'category' => "hats",
                'size_id' => $size->id,
                'pattern_id' => $validatedData['id'],
                'data' => json_encode($hat), 
                'updated_at' => now(),                    
            ]);
            $pattern = Pattern::find($hat->pattern_id);
            $pattern->touch();
            if($submitted){
               
                Notification::create([
                    'user_id' => $pattern->maker_id,
                    'message' => "Pattern: {$pattern->pattern_number} has been submitted",
                    'size' => $hat->size_id === 1 ? 'Small' : ($hat->size_id === 2 ? 'Medium' : ($hat->size_id === 3 ? 'Large' : 'X-Large')),
                    'is_read' => false,
                ]);
                return response()->json(['message' => $message], 201);
            }else{
                return response()->json(['message' => $message], 201);
            }
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {

            return response()->json(['error' => 'An error occurred while updating the hat pattern.'], 500);
        }
    }

    /**
     * Delete a hat pattern based on the provided ID.
     *
     * @param int $id The ID of the hat pattern to be deleted
     * @return \Illuminate\Http\JsonResponse A JSON response indicating the result of the deletion
     */
    public function destroy($id)
    {
      
        $hat = Hat::find($id);
        if (!$hat) {
            return response()->json(['error' => 'Hat not found'], 404);
        }
        $hat->delete();
        return response()->json(['message' => 'Hat pattern deleted successfully'], 200);
    }


    
    /**
     * Get patterns by the specified maker ID.
     *
     * This method retrieves patterns associated with a specific maker based on the provided maker ID.
     *
     * @param int $makerId The ID of the maker for which patterns are to be retrieved.
     * @return \Illuminate\Http\JsonResponse A JSON response containing the patterns associated with the maker.
     */
    public function getPatternsByMakerId($makerId)
    {
      
        if (!is_numeric($makerId)) {
            return response()->json(['error' => 'Invalid maker ID.'], 400);
        }

       
        $patterns = Pattern::with('hats')->where('maker_id', $makerId)->get();

       
        if ($patterns->isEmpty()) {
            return response()->json(['message' => 'No patterns found for this maker ID.'], 404);
        }

        return response()->json($patterns, 200);
    }

    
}
