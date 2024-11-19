<?php

namespace App\Http\Controllers;

use App\Models\Pattern;
use App\Models\Size;
use App\Models\Notification;
use App\Models\MeasurementHistory;
use App\Models\Scarf;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
class ScarfController extends Controller
{
    public function updateOFCreate(Request $request, $id = null)
{
    try {
        $validatedData = $request->validate([
            'pattern_number' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'outer_material' => 'required|string|max:255',
            'lining_material' => 'required|string|max:255',
            'approval_state' => 'required|string', 
            'submit_date' => 'required|date_format:d/m/Y',
            'approval_time' => 'required|date_format:d/m/Y',
            'size' => 'required|string|in:small,medium,large,x-large', 
            
            'body' => 'sometimes|array',
            'fringers' => 'sometimes|array',
            'edges' => 'sometimes|array',
        ]);

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

        $sizeValue = $sizeMapping[$validatedData['size']] ?? null;

        if ($sizeValue === null) {
            return response()->json(['error' => 'Invalid size provided'], 422);
        }

        $size = Size::updateOrCreate(
            ['name' => $validatedData['size']],
            ['pattern_id' => $pattern->id, 'size_value' => $sizeValue]
        );

        $scarf = Scarf::updateOrCreate(
            ['pattern_id' => $pattern->id, 'size_id' => $size->id],
            [
                'body' => isset($validatedData['body']) ? json_encode($validatedData['body']) : null,
                'fringers' => isset($validatedData['fringers']) ? json_encode($validatedData['fringers']) : null,
                'edges' => isset($validatedData['edges']) ? json_encode($validatedData['edges']) : null,
                'saved' => true,
                'submitted' => true,
                'submit_date' => $formattedSubmitDate,
                'approval_state' => $validatedData['approval_state'],
                'approval_time' => $formattedApprovalDate,
            ]
        );

        return response()->json(['message' => $scarf->submitted ? "Submitted" : "Saved"], 201);

    } catch (ValidationException $e) {
        return response()->json(['error' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'An error occurred while updating the scarf pattern.'], 500);
    }
}

    public function createScarfPattern(Request $request)
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
                'submit' => 'required',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 


                'sizes' => 'required|array',
                'sizes.*.name' => 'required|string',
                'sizes.*.measurements' => 'required|array',
        
        
                'sizes.*.measurements.body.length' => 'nullable|numeric',
                'sizes.*.measurements.body.width' => 'nullable|numeric',

                'sizes.*.measurements.fringers.length' => 'nullable|numeric',
                'sizes.*.measurements.fringers.width' => 'nullable|numeric',


                'sizes.*.measurements.edges.length' => 'nullable|numeric',
                'sizes.*.measurements.edges.width' => 'nullable|numeric',
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
                'brand' => $validatedData['brand'],
                'category' => $validatedData['category'],
                'outer_material' => $validatedData['outer_material'],
                'lining_material' => $validatedData['lining_material'],
                'image' => $validatedData['image'],
            ]);

            $sizeID = 1;
            foreach ($validatedData['sizes'] as $sizeData) {
              
                $size = Size::firstOrCreate(['name' => $sizeData['name']]);
                $save = ($sizeID === (int) $request->size_to_save);
                $submitted = ($sizeID === (int) $request->size_to_save) && filter_var($validatedData['submit'], FILTER_VALIDATE_BOOLEAN);

               $scarf =  Scarf::create([
                    'pattern_id' => $pattern->id,
                    'size_id' => $size->id,
                    'body' => json_encode($sizeData['measurements']['body']),
                    'fringers' => json_encode($sizeData['measurements']['fringers']),
                    'edges' => json_encode($sizeData['measurements']['edges']),
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
                        'data' => json_encode($scarf), 
                        'updated_at' => now(),                    
                    ]);
                   }

                if($submitted){
                    $pattern = Pattern::find($scarf->pattern_id);
                    Notification::create([
                        'user_id' => $pattern->maker_id,
                        'message' => "Pattern: {$pattern->pattern_number} has been submitted",
                        'size' => $scarf->size_id === 1 ? 'Small' : ($scarf->size_id === 2 ? 'Medium' : ($scarf->size_id === 3 ? 'Large' : 'X-Large')),
                        'is_read' => false,
                    ]);
                }
                $sizeID++;
            }

            return response()->json([
                'message' => 'Scarf pattern created successfully.',
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors(), 'message' => 'Validation failed.'], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the scarf pattern.', 'message' => $e->getMessage()], 500);
        }
    }

    public function index()
    {
       
        $scarves = Scarf::with('pattern', 'size')->get();
        return response()->json($scarves, 200);
    }

    public function show($id)
    {
        
        $scarf = Scarf::with('pattern', 'size')->find($id);
        if (!$scarf) {
            return response()->json(['error' => 'Scarf not found'], 404);
        }
        return response()->json($scarf, 200);
    }

    public function update(Request $request, $id)
    {
        try {
          
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string',
                'size_to_save' => 'required',
                'id' => 'required',
                'submit' => 'nullable',
                'scarf_id' => 'required',
                
                
                
                'body' => 'sometimes|required|array',
                'fringers' => 'sometimes|required|array',
                'edges' => 'sometimes|required|array',

                'body.length' => 'nullable|numeric',
                'body.width' => 'nullable|numeric',

                'fringers.length' => 'nullable|numeric',
                'fringers.width' => 'nullable|numeric',


                'edges.length' => 'nullable|numeric',
                'edges.width' => 'nullable|numeric',
                
            ]);

              
              
            // $previous->previous_data = $previous->toJson();
            // $dataToUpdate = $previous->getAttributes();
  
            
           
          //  $previous->update($dataToUpdate);

            $size = Size::updateOrCreate(
                ['name' => $validatedData['name']],
                ['pattern_id' => $validatedData['id']]
            );
    
            $saved = $size->id === $validatedData['size_to_save'];
            $submitted = $validatedData['submit'] ?? false;
            $submit_date = null;
            $message = "";
            $scarf = Scarf::findOrFail($validatedData['scarf_id']);
  
            if ($scarf->submitted && $submitted) {
                $message = "Saved";
                $submit_date = $scarf->submit_date;
            }else if($submitted){
                $message = "Submitted";
            }else{
                $message = "Saved";
            }
            
            $scarf = $scarf ? $scarf : new Scarf(); 
            $scarf->update(
                ['pattern_id' => $validatedData['id'], 'size_id' => $size->id],
                [
                    'body' => isset($validatedData['body']) ? json_encode($validatedData['body']) : null,
                    'fringers' => isset($validatedData['fringers']) ? json_encode($validatedData['fringers']) : null,
                    'edges' => isset($validatedData['edges']) ? json_encode($validatedData['edges']) : null,
                    'saved' => $saved,
                    'submitted' => $submitted,
                   'submit_date' => $submitted ? now() :  $submit_date,
                    // 'previous_data' => $previous->previous_data
                ]
            );
            MeasurementHistory::create([
                'category' => "scarves",
                'size_id' => $size->id,
                'pattern_id' => $validatedData['id'],
                'data' => json_encode($scarf), 
                'updated_at' => now(),                    
            ]);
            $pattern = Pattern::find($scarf->pattern_id);
            $pattern->touch();
            if($submitted){
              
                Notification::create([
                    'user_id' => $pattern->maker_id,
                    'message' => "Pattern: {$pattern->pattern_number} has been submitted",
                    'size' => $scarf->size_id === 1 ? 'Small' : ($scarf->size_id === 2 ? 'Medium' : ($scarf->size_id === 3 ? 'Large' : 'X-Large')),
                    'is_read' => false,
                ]);
                return response()->json(['message' => $message], 201);
            }else{
                return response()->json(['message' => $message], 201);
            }
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating scarf pattern: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while updating the scarf pattern.'], 500);
        }
    }

    public function revertAllScarves()
{
   
    $scarves = Scarf::whereNotNull('previous_data')->get();

   
    if ($scarves->isEmpty()) {
        return response()->json(['message' => 'No scarves with previous data to revert.'], 404);
    }

  
    foreach ($scarves as $scarf) {
       
        $previousData = json_decode($scarf->previous_data, true);

       
        $scarf->previous_data = $scarf->toJson();

      
        $scarf->update($previousData);
    }

    return response()->json(['message' => 'All scarves with previous data have been reverted.'], 200);
}
public function getAllPreviousData()
{

    $scarves = Scarf::whereNotNull('previous_data')->get();


    if ($scarves->isEmpty()) {
        return response()->json(['message' => 'No scarves with previous data found.'], 404);
    }


    return response()->json([
        'all_records' => $scarves
    ], 200);
}


    public function destroy($id)
    {
      
        $scarf = Scarf::find($id);
        if (!$scarf) {
            return response()->json(['error' => 'Scarf not found'], 404);
        }
        $scarf->delete();
        return response()->json(['message' => 'Scarf pattern deleted successfully'], 200);
    }

    public function getPatternsByMakerId($makerId)
    {
        
        if (!is_numeric($makerId)) {
            return response()->json(['error' => 'Invalid maker ID.'], 400);
        }

       
        $patterns = Pattern::with('scarves')->where('maker_id', $makerId)->get();

       
        if ($patterns->isEmpty()) {
            return response()->json(['message' => 'No patterns found for this maker ID.'], 404);
        }

        return response()->json($patterns, 200);
    }
}
