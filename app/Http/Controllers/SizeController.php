<?php

namespace App\Http\Controllers;
use App\Models\Size;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
        ]);

        $size = Size::create($validatedData);
        return response()->json($size, 201);
    }
}
