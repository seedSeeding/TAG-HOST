<?php

namespace App\Http\Controllers;

use App\Models\Pattern;
use App\Models\Size;
use App\Models\Glove;
use App\Models\Hat;
use App\Models\Scarf;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PatternDataController extends Controller
{


    public function getAllData(Request $request)
{
    try {
        // Initialize an empty data array with categories for gloves, scarves, and hats
        $data = [ 
           "gloves" => [],
           "scarves" => [],
           "hats" => []
        ];

        // Retrieve all patterns categorized as 'gloves' with their associated glove details
        $gloves = Pattern::where('category', 'gloves')->with('gloves')->get();  

        // Retrieve all patterns categorized as 'hats' with their associated hat details
        $hats = Pattern::where('category', 'hats')->with('hats')->get();

        // Retrieve all patterns categorized as 'scarves' with their associated scarf details
        $scarves = Pattern::where('category', 'scarves')->with('scarves')->get();

        // Store the retrieved data in the corresponding category arrays
        $data['gloves'] = $gloves;
        $data['hats'] = $hats;
        $data['scarves'] = $scarves;

        // Return the collected data as a JSON response with a success status (200)
        return response()->json($data, 200);

    } catch (\Exception $e) {
        // In case of an exception, return an error response with the exception message and status code 500
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function get_total_records(){
    try {
        // Retrieve all patterns, including related gloves, scarves, and hats
        $patterns = Pattern::with('gloves', 'scarves', 'hats')->get();
    
        // Initialize counters for approved items, reported issues, and total records
        $approvedTotal = 0;
        $issueReportedTotal = 0;
        $totalRecords = $patterns->count();
        $uniqueBrands = $patterns->pluck('brand')->unique()->count();
    
        // Loop through each pattern to check the approval states of related items
        foreach ($patterns as $pattern) {
            
            // Merge gloves, scarves, and hats into one collection
            $data = $pattern->gloves->merge($pattern->scarves)->merge($pattern->hats);
            
            // Loop through the merged collection and count approval states
            foreach ($data as $item) {
                
                // Increment approved total if the item is approved
                if ($item->approval_state === 'approved') {
                    $approvedTotal++;
                // Increment issue reported total if the item is under revision
                } elseif ($item->approval_state === 'revision') {
                    $issueReportedTotal++;
                }
            }
        }
    
        // Prepare the response data
        $response = [
            'approved_total' => $approvedTotal,  // Total number of approved items
            'issue_reported_total' => $issueReportedTotal,  // Total number of reported issues
            'total_records' => $totalRecords,  // Total number of patterns
            'total_brand' => $uniqueBrands,  // Total number of unique brands
        ];
    
        // Return the response as JSON with a 200 HTTP status code
        return response()->json($response, 200);
    } catch (\Exception $e) {
        // Return error response in case of an exception
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/********************************************************************************************************************************* */
public function getFitISsuesByPattern() {
    try {
        // Retrieve all patterns including related gloves, scarves, and hats
        $patterns = Pattern::with('gloves', 'scarves', 'hats')->get();
    
        // Initialize output array to hold data grouped by brand
        $output = [];
    
        // Loop through patterns grouped by brand
        foreach ($patterns->groupBy('brand') as $brand => $brandPatterns) {
            // Initialize data for the current brand
            $brandData = [
                'brand' => $brand,
                'gloves' => [],
                'scarves' => [],
                'hats' => []
            ];
    
            // Function to initialize measurement counts for different issues
            $initMeasurements = function () {
                return [
                    "Too Tight" => 0, "Too Loose" => 0, "Uneven Sizing" => 0,
                    "Length Mismatch" => 0, "Width Mismatch" => 0, "Height Discrepancy" => 0,
                    "Ssymmetrical Fit" => 0, "Too Small" => 0, "Too Large" => 0,
                    "Improper Curve" => 0, "Too narrow" => 0, "Too Short" => 0, "Too Wide" => 0
                ];
            };
    
            // Loop through each item type (gloves, scarves, hats)
            foreach (['gloves', 'scarves', 'hats'] as $itemType) {
                // Initialize array to store size aggregates for each item type
                $sizeAggregates = [];
    
                // Loop through each pattern for the brand
                foreach ($brandPatterns as $pattern) {
                    // Loop through related items (gloves, scarves, hats) for the current pattern
                    foreach ($pattern->$itemType as $item) {
                        $size_id = $item->size_id;
    
                        // If size hasn't been encountered yet, initialize the measurements for it
                        if (!isset($sizeAggregates[$size_id])) {
                            $sizeAggregates[$size_id] = $initMeasurements();
                        }
    
                        // Loop through all measurement fields and check if the reason matches any measurement
                        foreach ($sizeAggregates[$size_id] as $field => &$value) {
                            $reasonParts = explode(",", $item->reason);
                            // Check if the third part of the reason matches a measurement field
                            if (isset($reasonParts[2])) { 
                                $formattedReason = $reasonParts[2];
    
                                // Increment the count for the corresponding measurement issue
                                if ($field === $formattedReason) {
                                    $value += 1 ;
                                }
                            }
                        }
                    }
                }
    
                // After aggregating the measurements, add them to the brand data for each item type
                foreach ($sizeAggregates as $size_id => $measurements) {
                    $brandData[$itemType][] = array_merge(['size_id' => $size_id], $measurements);
                }
            }
    
            // Add the brand data to the output array
            $output[] = $brandData;
        }
    
        // Return the aggregated data as a JSON response with a 200 HTTP status code
        return response()->json($output, 200);
    } catch (\Exception $e) {
        // Log the error and return a 500 error response in case of failure
        \Log::error('Error processing patterns: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/********************************************************************************************************************************* */
public function getStateTotalByBrandSize(){
    try {
        // Fetching all patterns with their related gloves, scarves, and hats
        $patterns = Pattern::with('gloves', 'scarves', 'hats')->get();
    
        // Grouping patterns by category (e.g., gloves, scarves, hats)
        $data = $patterns->groupBy('category')->map(function ($items, $category) {
            // Grouping patterns by brand
            $brands = $items->groupBy('brand')->map(function ($patterns, $brand) {
                $sizesData = [];
    
                // Looping through all sizes (1 to 4) for each brand
                foreach (range(1, 4) as $sizeId) {
                    // Initializing counters for the status of each size
                    $approvedCount = 0;
                    $revisionCount = 0;
                    $droppedCount = 0;
    
                    // Looping through each pattern and its items (gloves, scarves, hats)
                    foreach ($patterns as $pattern) {
                        foreach (['gloves', 'scarves', 'hats'] as $category) {
                            foreach ($pattern->$category as $item) {
                                // Checking if the size_id matches the current size in the loop
                                if ($item->size_id == $sizeId) {
                                    // Counting the approval states
                                    if ($item->approval_state === 'approved') {
                                        $approvedCount++;
                                    }
                                    if ($item->approval_state === 'revision') {
                                        $revisionCount++;
                                    }
                                    if ($item->approval_state === 'dropped') {
                                        $droppedCount++;
                                    }
                                }
                            }
                        }
                    }
                    
                    // Storing the counts for the current size
                    $sizesData[] = [
                        'size_id' => $sizeId,
                        'approved' => $approvedCount,
                        'revision' => $revisionCount,
                        'dropped' => $droppedCount,
                    ];
                }
    
                // Returning the data for the brand along with the size-specific counts
                return [
                    'brand' => $brand,
                    'records' => $sizesData,
                ];
            })->values();
    
            // Returning the final grouped data by category (gloves, scarves, hats)
            return [
                'category' => $category,
                'data' => $brands,
            ];
        })->values();
    
        // Returning the response with the processed data
        return response()->json($data, 200);
    } catch (\Exception $e) {
        // Handling any exceptions and returning an error response
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/********************************************************************************************************************************* */
public function getTimeToApproval(){
    try {
        // Fetching all patterns with their related gloves, scarves, and hats
        $patterns = Pattern::with('gloves', 'scarves', 'hats')->get();
        $result = [];
    
        // Iterating over each pattern
        foreach ($patterns as $pattern) {
            $brand = $pattern->brand;
            
            // Initializing the result array for the brand if not already set
            if (!isset($result[$brand])) {
                $result[$brand] = ['gloves' => [], 'scarves' => [], 'hats' => []];
            }
    
            // Processing gloves for the pattern
            foreach ($pattern->gloves as $glove) {
                // Checking if the glove is approved and has an approval time
                if ($glove->approval_state === "approved" && $glove->approval_time) {
                    $approvalTime = \Carbon\Carbon::parse($glove->approval_time);
                    $year = $approvalTime->year;
                    $month = strtolower($approvalTime->format('M'));

                    // Initializing the yearly record for gloves if not already set
                    if (!isset($result[$brand]['gloves'][$year])) {
                        $result[$brand]['gloves'][$year] = ['record' => []];
                    }

                    // Initializing the monthly record for gloves if not already set
                    if (!isset($result[$brand]['gloves'][$year]['record'][$month])) {
                        $result[$brand]['gloves'][$year]['record'][$month] = 0;
                    }

                    // Incrementing the record for the month
                    $result[$brand]['gloves'][$year]['record'][$month]++;
                }
            }

            // Processing scarves for the pattern
            foreach ($pattern->scarves as $scarf) {
                // Checking if the scarf is approved and has an approval time
                if ($scarf->approval_state === "approved" && $scarf->approval_time) {
                    $approvalTime = \Carbon\Carbon::parse($scarf->approval_time);
                    $year = $approvalTime->year;
                    $month = strtolower($approvalTime->format('M'));

                    // Initializing the yearly record for scarves if not already set
                    if (!isset($result[$brand]['scarves'][$year])) {
                        $result[$brand]['scarves'][$year] = ['record' => []];
                    }

                    // Initializing the monthly record for scarves if not already set
                    if (!isset($result[$brand]['scarves'][$year]['record'][$month])) {
                        $result[$brand]['scarves'][$year]['record'][$month] = 0;
                    }

                    // Incrementing the record for the month
                    $result[$brand]['scarves'][$year]['record'][$month]++;
                }
            }

            // Processing hats for the pattern
            foreach ($pattern->hats as $hat) {
                // Checking if the hat is approved and has an approval time
                if ($hat->approval_state === "approved" && $hat->approval_time) {
                    $approvalTime = \Carbon\Carbon::parse($hat->approval_time);
                    $year = $approvalTime->year;
                    $month = strtolower($approvalTime->format('M'));

                    // Initializing the yearly record for hats if not already set
                    if (!isset($result[$brand]['hats'][$year])) {
                        $result[$brand]['hats'][$year] = ['record' => []];
                    }

                    // Initializing the monthly record for hats if not already set
                    if (!isset($result[$brand]['hats'][$year]['record'][$month])) {
                        $result[$brand]['hats'][$year]['record'][$month] = 0;
                    }

                    // Incrementing the record for the month
                    $result[$brand]['hats'][$year]['record'][$month]++;
                }
            }
        }
    
        // Formatting the result into a more structured format for the response
        $formattedResult = [];
        foreach ($result as $brand => $categories) {
            $formattedBrandData = ['brand' => $brand];
            foreach ($categories as $category => $yearlyRecords) {
                $formattedCategoryData = [];
                foreach ($yearlyRecords as $year => $data) {
                    $formattedCategoryData[] = ['year' => $year, 'record' => $data['record']];
                }
                $formattedBrandData[$category] = $formattedCategoryData;
            }
            $formattedResult[] = $formattedBrandData;
        }
    
        // Returning the structured response as JSON
        return response()->json($formattedResult, 200);
    } catch (\Exception $e) {
        // Handling any errors and logging the exception
        \Log::error('Error fetching and formatting patterns: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/********************************************************************************************************************************* */
public function getTotalState()
{
    // Fetching the total counts for each approval state of gloves
    $glovesTotals = Glove::select('approval_state', \DB::raw('count(*) as total'))
        ->groupBy('approval_state')
        ->get()
        ->pluck('total', 'approval_state')
        ->toArray(); // Converting to an associative array

    // Fetching the total counts for each approval state of hats
    $hatsTotals = Hat::select('approval_state', \DB::raw('count(*) as total'))
        ->groupBy('approval_state')
        ->get()
        ->pluck('total', 'approval_state')
        ->toArray(); // Converting to an associative array

    // Fetching the total counts for each approval state of scarves
    $scarvesTotals = Scarf::select('approval_state', \DB::raw('count(*) as total'))
        ->groupBy('approval_state')
        ->get()
        ->pluck('total', 'approval_state')
        ->toArray(); // Converting to an associative array

    // Structuring the result array with approval states for gloves, hats, and scarves
    $result = [
        [
            'gloves' => [
                'Approved' => $glovesTotals['approved'] ?? 0, // If approved exists, use it; otherwise, default to 0
                'Pending' => $glovesTotals['pending'] ?? 0,   // If pending exists, use it; otherwise, default to 0
                'Revision' => $glovesTotals['revision'] ?? 0, // If revision exists, use it; otherwise, default to 0
                'Dropped' => $glovesTotals['dropped'] ?? 0    // If dropped exists, use it; otherwise, default to 0
            ]
        ],
        [
            'hats' => [
                'Approved' => $hatsTotals['approved'] ?? 0, // If approved exists, use it; otherwise, default to 0
                'Pending' => $hatsTotals['pending'] ?? 0,   // If pending exists, use it; otherwise, default to 0
                'Revision' => $hatsTotals['revision'] ?? 0, // If revision exists, use it; otherwise, default to 0
                'Dropped' => $hatsTotals['dropped'] ?? 0    // If dropped exists, use it; otherwise, default to 0
            ]
        ],
        [
            'scarves' => [
                'Approved' => $scarvesTotals['approved'] ?? 0, // If approved exists, use it; otherwise, default to 0
                'Pending' => $scarvesTotals['pending'] ?? 0,   // If pending exists, use it; otherwise, default to 0
                'Revision' => $scarvesTotals['revision'] ?? 0, // If revision exists, use it; otherwise, default to 0
                'Dropped' => $scarvesTotals['dropped'] ?? 0    // If dropped exists, use it; otherwise, default to 0
            ]
        ]
    ];

    // Returning the structured result as a JSON response
    return response()->json($result, 200);
}

/************************************************************************************************************************************ */
public function getApprovalStatesByBrandAndSize(Request $request)
{
    try {
        // Fetch patterns with related categories: gloves, scarves, and hats
        $patterns = Pattern::with(['gloves', 'scarves', 'hats'])
            // ->where('brand', $request->brand) // (Optional) Filter by brand
            ->get();

        $result = [];

        // Loop through each pattern to process the data
        foreach ($patterns as $pattern) {
            // Prepare initial category data structure
            $categoryData = [
                'category' => $pattern->category,
                strtolower($pattern->category) => [],
            ];

            // Check if the pattern is of category 'gloves'
            if ($pattern->category === 'gloves') {
                // Filter gloves based on the provided size_id
                $filteredGloves = $pattern->gloves->filter(function ($glove) use ($request) {
                    return $glove->size_id == $request->size_id;
                });

                // If filtered gloves are found, calculate approval counts
                if ($filteredGloves->isNotEmpty()) {
                    $categoryData[strtolower($pattern->category)][] = $this->getApprovalCounts($filteredGloves);
                }
            }
            
            // Check if the pattern is of category 'hats'
            elseif ($pattern->category === 'hats') {
                // Filter hats based on the provided size_id
                $filteredHats = $pattern->hats->filter(function ($hat) use ($request) {
                    return $hat->size_id == $request->size_id;
                });

                // If filtered hats are found, calculate approval counts
                if ($filteredHats->isNotEmpty()) {
                    $categoryData[strtolower($pattern->category)][] = $this->getApprovalCounts($filteredHats);
                }
            }
            
            // Check if the pattern is of category 'scarves'
            elseif ($pattern->category === 'scarves') {
                // Filter scarves based on the provided size_id
                $filteredScarves = $pattern->scarves->filter(function ($scarf) use ($request) {
                    return $scarf->size_id == $request->size_id;
                });

                // If filtered scarves are found, calculate approval counts
                if ($filteredScarves->isNotEmpty()) {
                    $categoryData[strtolower($pattern->category)][] = $this->getApprovalCounts($filteredScarves);
                }
            }

            // Add the category data to the result if it is not empty
            if (!empty($categoryData[strtolower($pattern->category)])) {
                $result[] = $categoryData;
            }
        }

        // Return the result as a JSON response
        return response()->json($result, 200);
    } catch (\Exception $e) {
        // Log the error and return a 500 response with the error message
        \Log::error('Error fetching patterns: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/***************************************************************************************** */
private function getApprovalCounts($items)
{
    
    return [
        'Approved' => $items->where('approval_state', 'approved')->count(),
        'Pending' => $items->where('approval_state', 'pending')->count(),
        'Revision' => $items->where('approval_state', 'revision')->count(),
        'Dropped' => $items->where('approval_state', 'dropped')->count(),
    ];
}

/************************************************************************************************************************************ */
public function getApprovalStatesByYear(Request $request)
{
    try {
        // Validate incoming request parameters
        $request->validate([
            'brand' => 'required|string',  // Brand is required and must be a string
            'size_id' => 'required|integer',  // Size ID is required and must be an integer
            'year' => 'required|integer',  // Year is required and must be an integer
        ]);

        // Fetch patterns with related categories: gloves, scarves, and hats, filtered by brand
        $patterns = Pattern::with(['gloves', 'scarves', 'hats'])
            ->where('brand', $request->brand)
            ->get();

        $result = [];

        // Loop through each pattern to process the data
        foreach ($patterns as $pattern) {
            // Prepare the initial category data structure
            $categoryData = [
                'category' => $pattern->category,
                strtolower($pattern->category) => [],
            ];

            // Initialize an empty collection for items
            $items = collect();

            // Filter gloves based on the provided size_id
            if ($pattern->category === 'gloves') {
                $items = $pattern->gloves->filter(function ($glove) use ($request) {
                    return $glove->size_id == $request->size_id;
                });
            } 
            // Filter hats based on the provided size_id
            elseif ($pattern->category === 'hat') {
                $items = $pattern->hats->filter(function ($hat) use ($request) {
                    return $hat->size_id == $request->size_id;
                });
            } 
            // Filter scarves based on the provided size_id
            elseif ($pattern->category === 'scarf') {
                $items = $pattern->scarves->filter(function ($scarf) use ($request) {
                    return $scarf->size_id == $request->size_id;
                });
            }

            // If filtered items are found, calculate monthly approval counts and add to the result
            if ($items->isNotEmpty()) {
                $monthlyApprovalCounts = $this->getMonthlyApprovalCounts($items, $request->year);
                $categoryData[strtolower($pattern->category)] = $monthlyApprovalCounts;
                $result[] = $categoryData;
            }
        }

        // Return the result as a JSON response
        return response()->json($result, 200);
    } catch (\Exception $e) {
        // Log the error and return a 500 response with the error message
        \Log::error('Error fetching patterns: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/*********************************************************************************************** */
private function getMonthlyApprovalCounts($items, $year)
{
  
    $monthlyCounts = [];

    
    foreach ($items as $item) {
        
        $approvalTime = \Carbon\Carbon::parse($item->approval_time);

        
        if ($approvalTime->year == $year) {
            $month = $approvalTime->format('F');
            if (!isset($monthlyCounts[$month])) {
                $monthlyCounts[$month] = 0;
            }
           
            if ($item->approval_state === 'approved') {
                $monthlyCounts[$month]++;
            }
        }
    }

    return $monthlyCounts;
}
   
/***************************************************************************************************************************** */
public function getIssuesBySizeAndCategory(Request $request)
{
    // Validate incoming request parameters
    $request->validate([
        'size_id' => 'required|integer',  // Size ID is required and must be an integer
        'category' => 'required|string|in:gloves,scarves,hats',  // Category is required and must be one of the specified values (gloves, scarves, hats)
    ]);

    // Initialize the result array to store the issues data
    $result = [];

    // Fetch patterns that have related items in the specified category (gloves, scarves, or hats)
    $patterns = Pattern::with(['gloves', 'scarves', 'hats'])
        ->whereHas($request->category, function ($query) use ($request) {
            // Filter by size_id for the given category
            $query->where('size_id', $request->size_id);
        })
        ->get();

    // If no patterns are found, return a 404 response with a message
    if ($patterns->isEmpty()) {
        return response()->json(['message' => 'No patterns found for the given category and size.'], 404);
    }

    // Loop through each pattern to process the issues data
    foreach ($patterns as $pattern) {
        // Initialize category size data with default issue counts
        $categorySizeData = [
            'category' => $pattern->category,
            'size' => $request->size_id,
            'brand' => $pattern->brand,
            'total_issues' => [
                'tooTight'=> 0,
                'tooSmall' => 0,
                'tooLarge' => 0,
                'tooLoose' => 0,
                'unevenSizing' => 0,
                'lengthMismatch' => 0,
                'widthMismatch' => 0,
                'heightDiscrepancy' => 0,
                'asymmetricalFit' => 0,
                'improperCurve' => 0,
                'tooNarrow' => 0,
                'tooShort' => 0,
                'tooWide' => 0,
            ],
        ];

        // Get the items from the category (either gloves, scarves, or hats)
        $items = $pattern->{$request->category};

        // Loop through each item and check for revision approval state
        foreach ($items as $item) {
            // If the item is under revision
            if ($item->approval_state === 'revision') {
                // If a reason is specified, split the reasons and count them
                if (isset($item->reason)) {
                    $reasons = explode(',', $item->reason); 

                    // Count the reasons and increment the respective issue categories
                    switch ($reasons[2]) {
                        case 'Too Small':
                            $categorySizeData['total_issues']['tooSmall']++;
                            break;
                        case 'Too Tight':
                            $categorySizeData['total_issues']['tooTight']++;
                            break;
                        case 'Too Large':
                            $categorySizeData['total_issues']['tooLarge']++;
                            break;
                        case 'Too Loose':
                            $categorySizeData['total_issues']['tooLoose']++;
                            break;
                        case 'Uneven Sizing':
                            $categorySizeData['total_issues']['unevenSizing']++;
                            break;
                        case 'Length Mismatch':
                            $categorySizeData['total_issues']['lengthMismatch']++;
                            break;
                        case 'Width Mismatch':
                            $categorySizeData['total_issues']['widthMismatch']++;
                            break;
                        case 'Height Discrepancy':
                            $categorySizeData['total_issues']['heightDiscrepancy']++;
                            break;
                        case 'Asymmetrical Fit':
                            $categorySizeData['total_issues']['asymmetricalFit']++;
                            break;
                        case 'Improper Curve':
                            $categorySizeData['total_issues']['improperCurve']++;
                            break;
                        case 'Too Narrow':
                            $categorySizeData['total_issues']['tooNarrow']++;
                            break;
                        case 'Too Short':
                            $categorySizeData['total_issues']['tooShort']++;
                            break;
                        case 'Too Wide':
                            $categorySizeData['total_issues']['tooWide']++;
                            break;
                    }
                }
            }
        }

        // Only add to the result if there are any issues counted (sum of total issues > 0)
        if (array_sum($categorySizeData['total_issues']) > 0) {
            $result[] = $categorySizeData;
        }
    }

    // Return the result as a JSON response
    return response()->json($result, 200);
}

/************************************************************************************************************************************ */
public function getMaterialPopularity(Request $request)
{
    // Validate incoming request parameters
    $request->validate([
        'date' => 'required',  // Date is required for filtering the year
        'brand' => "required|string"  // Brand is required and must be a string
    ]);

    // Assign the date parameter from the request
    $date = $request->date;

    // Initialize an array to track the count of materials
    $materials = [
        'Leather' => 0,
        'Spandex' => 0,
        'Lycra' => 0,
        'Wool' => 0,
        'Canvas' => 0,
        'Silk' => 0,
        'Chiffon' => 0,
        'Denim' => 0,
        'Cordura' => 0,
        'Latex' => 0,
        'Nitrile' => 0,
        'Neoprene' => 0,
        'Vinyl' => 0,
        'Cotton' => 0,
        'Polyester' => 0,
        'Kevlar' => 0,
        'Polyurethane' => 0,
        'Rubber' => 0,
        'Synthetic Leather' => 0,
        'Microfiber' => 0,
        'Nylon' => 0,
        'Silicone' => 0,
        'Velvet' => 0,
        'Rayon' => 0,
        'Taffeta' => 0,
        'Tweed' => 0,
        'Fleece' => 0,
        'Gore-Tex' => 0,
        'Cashmere' => 0,
        'Faux Fur' => 0,
    ];

    // Define the start and end dates based on the provided year
    $startDate = $request->date . '-01-01';  // Start of the year
    $endDate = $request->date . '-12-31';    // End of the year
    
    // Retrieve patterns for the given brand and within the date range
    $patterns = Pattern::where('brand', $request->brand)
        ->whereBetween('created_at', [$startDate, $endDate])
        ->get();    

    // Loop through each pattern and count the materials
    foreach ($patterns as $pattern) {
        // Check if the outer material exists in the materials array and increment its count
        if (array_key_exists($pattern->outer_material, $materials)) {
            $materials[$pattern->outer_material]++;
        }

        // Check if the lining material exists in the materials array and increment its count
        if (array_key_exists($pattern->lining_material, $materials)) {
            $materials[$pattern->lining_material]++;
        }
    }

    // Return the materials count as a JSON response
    return response()->json($materials, 200);
}

/************************************************************************************************************************ */
public function getBrandList()
{
    try {
        // Fetch all patterns from the database
        $patterns = Pattern::all();

        // Initialize an empty array to store unique brand names
        $brands = [];

        // Loop through each pattern to extract the brand
        foreach ($patterns as $pattern) {
            // Check if the brand is not already in the brands array
            if (!in_array($pattern->brand, $brands)) {
                // Add the brand to the array if it is not already present
                $brands[] = $pattern->brand;
            }
        }

        // Return the list of unique brands as a JSON response with a 200 status code
        return response()->json($brands, 200);
    } catch (\Exception $e) {
        // Return a JSON response with an error message if an exception occurs
        return response()->json(['error' => 'Failed to fetch brand list'], 500);
    }
}


/************************************************************************************************************************ */
public function getTotalsOfCompanies(Request $request)
{
    // Initialize an empty array to store results
    $result = [];

    // Retrieve all patterns and group them by brand, along with their related gloves, scarves, and hats
    $patterns = Pattern::with(['gloves', 'scarves', 'hats'])
        ->get()
        ->groupBy('brand');  // Group patterns by brand

    // Iterate over each brand and its associated patterns
    foreach ($patterns as $brand => $items) {
        $sizeData = []; // Initialize an array to store size-specific data

        // Loop through each pattern (product) for the given brand
        foreach ($items as $pattern) {
            
            // Iterate through each category (gloves, scarves, hats)
            foreach (['gloves', 'scarves', 'hats'] as $category) {
                // Loop through each item in the category (gloves, scarves, hats)
                foreach ($pattern->{$category} as $item) {
                    $sizeId = $item->size_id;  // Get the size ID of the current item

                    // If size data for this size ID doesn't exist, initialize it
                    if (!isset($sizeData[$sizeId])) {
                        $sizeData[$sizeId] = [
                            'size_id' => $sizeId,
                            'data' => [
                                'patterns' => 0,  // Total patterns for this size
                                'approved' => 0,  // Total approved patterns for this size
                                'revised' => 0,   // Total revised patterns for this size
                                'dropped' => 0,   // Total dropped patterns for this size
                            ],
                        ];
                    }

                    // Increment the total number of patterns for this size
                    $sizeData[$sizeId]['data']['patterns']++;

                    // Increment the appropriate count based on the approval state of the item
                    if ($item->approval_state === 'approved') {
                        $sizeData[$sizeId]['data']['approved']++;
                    } elseif ($item->approval_state === 'revision') {
                        $sizeData[$sizeId]['data']['revised']++;
                    } elseif ($item->approval_state === 'dropped') {
                        $sizeData[$sizeId]['data']['dropped']++;
                    }
                }
            }
        }

        // Add the processed data for each brand to the result array
        $result[] = [
            'brand' => $brand,
            'totals' => array_values($sizeData),  // Convert size data to an indexed array
        ];
    }

    // Return the final result as a JSON response with a 200 status code
    return response()->json($result, 200);
}

/*************************************************************************************************************** */
public function getIssueAnalysis(Request $request)
{
    try {
        // Validate the incoming request parameters
        $validator = Validator::make($request->all(), [
            'category' => 'required|string',  // 'category' must be a string
            'size_id' => 'required|numeric',  // 'size_id' must be numeric
        ]);

        // If validation fails, return a 422 error with validation messages
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Extract the category and size_id from the request
        $category = $request->category;  
        $size_id = (int) $request->size_id;

        // Retrieve all patterns including their related categories (gloves, scarves, hats)
        $patterns = Pattern::with(['gloves', 'scarves', 'hats'])->get();

        $datas = [];

        // Iterate over each pattern to categorize and analyze the issues
        foreach ($patterns as $pattern) {
            // Initialize an empty array for the brand if it doesn't exist yet
            if (!isset($datas[$pattern->brand])) {
                $datas[$pattern->brand] = [];
            }

            // Iterate over the selected category (gloves, scarves, or hats)
            foreach ($pattern->{$category} as $item) {
                // Only consider items that are in the revision state and match the size_id
                if ($item->approval_state === 'revision' && $item->size_id === $size_id) {
                    // Split the reasons by commas
                    $reason = explode(',', $item->reason);

                    // Convert the reason array back to a string
                    $reasonString = implode(',', $reason);

                    // Check if the same reason already exists in the data
                    $existingReasonIndex = null;
                    foreach ($datas[$pattern->brand] as $index => $entry) {
                        if ($entry['reasons'] === $reasonString) {
                            $existingReasonIndex = $index;
                            break;
                        }
                    }

                    // If the reason already exists, just increment the frequency
                    if ($existingReasonIndex !== null) {
                        $datas[$pattern->brand][$existingReasonIndex]['frequencies']['frequency']++;
                    } else {
                        // If the reason doesn't exist, add it as a new entry
                        $datas[$pattern->brand][] = [
                            "reasons" => $reasonString,
                            "frequencies" => [
                                "part" => $reason[0],     // The part of the pattern being analyzed
                                "measure" => $reason[1] ?? '',  // The measurement (optional)
                                "reason" => $reason[2] ?? '',    // The specific reason (optional)
                                "frequency" => 1,          // Initial frequency count for this reason
                                "percentage" => 0          // Placeholder for the percentage calculation
                            ]
                        ];
                    }
                }
            }
        }

        // Calculate the total frequency for each brand and calculate the percentage
        foreach ($datas as $brand => &$entries) {
            $totalFrequency = 0;

            // Calculate the total frequency for all reasons within a brand
            foreach ($entries as $entry) {
                $totalFrequency += $entry['frequencies']['frequency'];
            }

            // Calculate the percentage for each entry based on its frequency
            foreach ($entries as &$entry) {
                if ($totalFrequency > 0) {
                    $entry['frequencies']['percentage'] = number_format(($entry['frequencies']['frequency'] / $totalFrequency) * 100, 2);
                } else {
                    // If total frequency is 0, set percentage to 0
                    $entry['frequencies']['percentage'] = 0;
                }
            }
        }

        // Return the analysis data as JSON
        return response()->json($datas, 200);
    } catch (\Exception $e) {
        // Log the error and return a 500 internal server error if an exception occurs
        \Log::error('Error fetching patterns: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}


/********************************************************************************************************************************* */
public function getCompaniesDataPattern() {
    try {
        // Retrieve all patterns along with their related categories (gloves, scarves, hats)
        $patterns = Pattern::with('gloves', 'scarves', 'hats')->get();

        // Group the patterns by their brand and process each brand
        $groupedPatterns = $patterns->groupBy('brand')->map(function($brandPatterns) {
            return [
                // Take the first pattern's brand as the brand name
                'brand' => $brandPatterns->first()->brand,  
                
                // Map each pattern record under the current brand
                'pattern_records' => $brandPatterns->map(function($pattern) {
                    return [
                        'pattern_number' => $pattern->pattern_number, // The pattern's unique identifier
                        'category' => $pattern->category, // The category (glove, scarf, hat, etc.)
                        'outline_material' => $pattern->outer_material, // Outer material of the pattern
                        'lining_material' => $pattern->lining_material, // Lining material of the pattern
                        
                        // For each glove under the current pattern
                        'data' => $pattern->gloves->map(function($glove) {
                            $number_of_revisions = 0;
                            
                            // Count the number of 'revision' occurrences in the reason field for the glove
                            if ($glove->approval_state == 'revision') {
                                $number_of_revisions = substr_count($glove->reason, 'revision');
                            }

                            return [
                                'size_id' => $glove->size_id, // Size ID for the glove
                                'created_at' => $glove->created_at->format('Y-m-d'), // Date when the glove was created
                                'approval_time' => $glove->approval_time ? $glove->approval_time->format('Y-m-d') : null, // Date of approval (if any)
                                'number_of_revisions' => $number_of_revisions, // Number of revisions for this glove
                                'approval_state' => $glove->approval_state // The approval state of the glove
                            ];
                        })->toArray() // Convert the gloves data to an array
                    ];
                })->toArray() // Convert the pattern records to an array
            ];
        })->values()->toArray(); // Get the values of the mapped data

        // Return the grouped and processed patterns as a JSON response
        return response()->json($groupedPatterns, 200);
    } catch (\Exception $e) {
        // Log any errors that occur during the process and return an error response
        \Log::error('Error fetching patterns: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/******************************************************************************************************************* */
public function getAdjusmentAcuuracy() {
    try {
        // Retrieve all patterns along with their related categories (gloves, scarves, hats)
        $patterns = Pattern::with('gloves', 'scarves', 'hats')->get();

        // Initialize an array to store category data with placeholders for all categories
        $categoryData = [
            ['category' => 'all', 'records' => []], // Data for all categories combined
            ['category' => 'gloves', 'records' => []], // Data for gloves category
            ['category' => 'scarves', 'records' => []], // Data for scarves category
            ['category' => 'hats', 'records' => []] // Data for hats category
        ];

        // Group patterns by brand
        $groupedByBrand = $patterns->groupBy('brand');

        // Loop through each brand's patterns
        foreach ($groupedByBrand as $brand => $brandPatterns) {
            $totalPatternsAll = 0; // Total patterns for all categories
            $totalApprovedAll = 0; // Total approved patterns for all categories

            // Initialize counters for each category
            $categoryCounters = [
                'gloves' => ['total_patterns' => 0, 'total_approved' => 0],
                'scarves' => ['total_patterns' => 0, 'total_approved' => 0],
                'hats' => ['total_patterns' => 0, 'total_approved' => 0]
            ];

            // Loop through each pattern under the brand
            foreach ($brandPatterns as $pattern) {
                $category = $pattern->category; // Get the category of the current pattern

                // Loop through each category type (gloves, scarves, hats)
                foreach (['gloves', 'scarves', 'hats'] as $itemType) {
                    foreach ($pattern->$itemType as $item) {
                        // Check if the item was submitted
                        if ($item->submitted) {
                            $totalPatternsAll++; // Increment the total pattern count for all categories
                            $categoryCounters[$category]['total_patterns']++; // Increment the specific category's pattern count

                            // If the item is approved, increment the approval counters
                            if ($item->approval_state === 'approved') {
                                $totalApprovedAll++; // Increment the total approved count for all categories
                                $categoryCounters[$category]['total_approved']++; // Increment the specific category's approved count
                            }
                        }
                    }
                }
            }

            // Calculate the adjustment accuracy for all categories combined
            $adjustmentAccuracyAll = $totalPatternsAll > 0
                ? round(($totalApprovedAll / $totalPatternsAll) * 100, 2)
                : 0;

            // Add the data for 'all' category
            $categoryData[0]['records'][] = [
                'brand' => $brand,
                'total_patterns' => $totalPatternsAll,
                'total_approved' => $totalApprovedAll,
                'adjusment_accuray' => $adjustmentAccuracyAll
            ];

            // Loop through each category and calculate the adjustment accuracy
            foreach (['gloves', 'scarves', 'hats'] as $category) {
                $totalPatterns = $categoryCounters[$category]['total_patterns'];
                $totalApproved = $categoryCounters[$category]['total_approved'];

                // Calculate the adjustment accuracy for the category
                $adjustmentAccuracy = $totalPatterns > 0
                    ? round(($totalApproved / $totalPatterns) * 100, 2)
                    : 0;

                // Add the data for the specific category
                $categoryData[$this->getCategoryIndex($category)]['records'][] = [
                    'brand' => $brand,
                    'total_patterns' => $totalPatterns,
                    'total_approved' => $totalApproved,
                    'adjusment_accuray' => $adjustmentAccuracy
                ];
            }
        }

        // Return the final data as a JSON response
        return response()->json($categoryData, 200);
    } catch (\Exception $e) {
        // Log any errors that occur during the process and return an error response
        \Log::error('Error fetching patterns: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/******************************************************************************************************************* */
public function getAdjusmentsByPattern(Request $request)
{
    try {
        // Retrieve patterns along with their related hats, gloves, and scarves
        $patterns = Pattern::with([
            'hats' => function ($query) {
                // Select specific fields for hats
                $query->select('id', 'pattern_id', 'size_id', 'strap', 'body_crown', 'crown', 'brim', 'bill');
            },
            'gloves' => function ($query) {
                // Select specific fields for gloves
                $query->select('id', 'pattern_id', 'size_id', 'palm_shell', 'black_shell', 'wrist', 'palm_thumb', 'back_thumb', 'index_finger', 'middle_finger', 'ring_finger', 'little_finger');
            },
            'scarves' => function ($query) {
                // Select specific fields for scarves
                $query->select('id', 'pattern_id', 'size_id', 'body', 'fringers', 'edges');
            }
        ])
        // Select fields for patterns (pattern_number, category, brand)
        ->get(['id', 'pattern_number', 'category', 'brand'])
        ->map(function ($pattern) {
            // Transform the hats data for the current pattern
            $pattern->hats = $pattern->hats->map(function ($hat) {
                return [
                    'size_id' => $hat->size_id,
                    'strap' => json_decode($hat->strap), // Decode JSON fields for hat parts
                    'body_crown' => json_decode($hat->body_crown),
                    'crown' => json_decode($hat->crown),
                    'brim' => json_decode($hat->brim),
                    'bill' => json_decode($hat->bill),
                ];
            });

            // Transform the gloves data for the current pattern
            $pattern->gloves = $pattern->gloves->map(function ($glove) {
                return [
                    'size_id' => $glove->size_id,
                    'palm_shell' => json_decode($glove->palm_shell), // Decode JSON fields for glove parts
                    'black_shell' => json_decode($glove->black_shell),
                    'wrist' => json_decode($glove->wrist),
                    'palm_thumb' => json_decode($glove->palm_thumb),
                    'back_thumb' => json_decode($glove->back_thumb),
                    'index_finger' => json_decode($glove->index_finger),
                    'middle_finger' => json_decode($glove->middle_finger),
                    'ring_finger' => json_decode($glove->ring_finger),
                    'little_finger' => json_decode($glove->little_finger),
                ];
            });

            // Transform the scarves data for the current pattern
            $pattern->scarves = $pattern->scarves->map(function ($scarf) {
                return [
                    'size_id' => $scarf->size_id,
                    'body' => json_decode($scarf->body), // Decode JSON fields for scarf parts
                    'fringers' => json_decode($scarf->fringers),
                    'edges' => json_decode($scarf->edges),
                ];
            });

            // Return the transformed pattern object
            return $pattern;
        });

        // Return the patterns data as a JSON response
        return response()->json($patterns, 200);
    } catch (\Exception $e) {
        // Handle any errors and return the error message as JSON
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

private function getCategoryIndex($category) {
    // Helper function to get the index based on the category
    switch ($category) {
        case 'gloves': return 1;
        case 'scarves': return 2;
        case 'hats': return 3;
        default: return 0;
    }
}

}