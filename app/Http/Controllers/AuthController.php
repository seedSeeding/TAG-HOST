<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class AuthController extends Controller
{
    /**
     * Logs in a user based on the provided request data.
     *
     * Validates the request data for 'log_id', 'password', and 'remember'.
     * Retrieves the user based on the provided 'log_id'.
     * Checks if the user exists and if the password matches the hashed password in the database.
     * Generates a token for the user if the credentials are correct.
     * Logs in the user using the provided credentials and remember option.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        
        $request->validate([
            'log_id' => 'required|string|max:255',
            'password' => 'required|string|min:8|max:255',
            'remember' => 'boolean', 
        ]);
    
        $credentials = $request->only('log_id', 'password');
        $remember = $request->boolean('remember'); 
       
        $user = User::where('log_id', $request->log_id)->first();
        
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect'], 401);
        }
    
     
        $token = $user->createToken($user->last_name . 'Auth-Token')->plainTextToken;
    
       
        /**
         * Attempt to authenticate a user using the given credentials.
         *
         * If authentication is successful, return a JSON response with login success message,
         * token type, token, and user role.
         *
        
         */
        if (Auth::attempt($credentials, $remember)) {
            return response()->json([
                'message' => 'Login Successful',
                'token_type' => 'Bearer',
                'token' => $token,
                'role' => $user->role
            ], 200);
        }
    
        return response()->json(['message' => 'Login failed'], 401); 
    }
    

    /**
     * Retrieve a list of users with roles 'Pattern Maker' or 'Senior Fashion Designer',
     * mask their passwords with asterisks, and return the list as a JSON response.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
{
    try {
        
        $users = User::whereIn('role', ['Pattern Maker', 'Senior Fashion Designer'])->get();

        
        /**
         * Iterates over each user in the collection and replaces the password with asterisks to hide the actual password.
        
         */
        $users->each(function($user) {
        
            $passwordLength = strlen($user->password);
            
        
            $user->password = str_repeat('*', $passwordLength);
        });

        
        return response()->json(['users' => $users], 200);
    } catch (\Exception $e) {
        
        \Log::error('Error fetching users: ' . $e->getMessage());

        
        return response()->json([
            'error' => 'An error occurred while fetching users.',
            'message' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Store a new user record based on the data provided in the request.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        
    try {
      
        $validator = Validator::make($request->all(), [
            'log_id' => 'required|string|unique:users,log_id',
            'last_name' => 'nullable|string',
            'first_name' => 'required|string',
            'middle' => 'nullable|string',
            'email' => 'required|string|email|unique:users,email',
            'address' => 'required|string',
            'role' => 'required|string',
            'number' => 'required|string',
            'age' => 'required|integer',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
            'password' => 'required|string|min:8',
        ]);

        /**
         * Store a newly created user in the database after validating the input data.
         *
         * If validation fails, return a JSON response with the validation errors.
         * If validation passes, hash the password, store the image in the 'public/profiles' directory,
         * and create a new user record in the database with the validated data.
         *
      
         */
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $validatedData['password'] = Hash::make($validatedData['password']);

        
        $imagePath = $request->file('image')->store('profiles', 'public');
        $validatedData['image'] = $imagePath;

        
        $user = User::create([
            'log_id' => $validatedData['log_id'],
            'last_name' => $validatedData['last_name'],
            'first_name' => $validatedData['first_name'],
            'middle' => $validatedData['middle'],
            'email' => $validatedData['email'],
            'address' => $validatedData['address'],
            'role' => $validatedData['role'],
            'number' => $validatedData['number'],
            'age' => $validatedData['age'],
            'image' => $validatedData['image'],
            'password' => $validatedData['password'],
        ]);

        return response()->json($user, 201);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
    
    
    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }
    /**
     * Update the specified user in the database with the validated data from the request.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            if($user){
                return response() -> json(["message" => $user->middle],200);
            }
            
            $validatedData = $request->validate([
                'log_id' => 'sometimes|required|string|unique:users,log_id,' . $user->id,
                'last_name' => 'nullable|string',
                'first_name' => 'sometimes|required|string',
                'middle' => 'nullable|string',
                'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
                'address' => 'sometimes|required|string',
                'role' => 'sometimes|required|string',
                'number' => 'sometimes|required|string',
                'age' => 'sometimes|required|integer',
                'password' => 'sometimes|nullable|string|min:8',
                'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',


            ]);
    
            if ($request->hasFile('image')) {
                if ($user->image) {
                    Storage::disk('public')->delete($user->image);
                }
                $validatedData['image'] = $request->file('image')->store('profiles', 'public');
            }
            
          
            if (!empty($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            } else {
                unset($validatedData['password']);
            }
    
        
            $user->update($validatedData);
    
            return response()->json([
                'message' => 'User updated successfully.',
                'user' => $user,
            ], 200);
    
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'User not found.',
                'message' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the user.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    public function update_user(Request $request)
    {
        try {
            $user = User::findOrFail($request->id);
            
            $validator = Validator::make($request->all(),[
                'log_id' => 'sometimes|required|string|unique:users,log_id,' . $user->id,
                'last_name' => 'nullable|string',
                'first_name' => 'sometimes|required|string',
                'middle' => 'nullable|string',
                'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
                'address' => 'sometimes|required|string',
                'role' => 'sometimes|required|string',
                'number' => 'sometimes|required|string',
                'age' => 'sometimes|required|integer',
                'password' => 'sometimes|nullable|string|min:8',
                'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors()
                ], 422);
            }
            $validatedData = $validator->validated();
            // $validatedData = $request->validate([
            //     'log_id' => 'sometimes|required|string|unique:users,log_id,' . $user->id,
            //     'last_name' => 'nullable|string',
            //     'first_name' => 'sometimes|required|string',
            //     'middle' => 'nullable|string',
            //     'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            //     'address' => 'sometimes|required|string',
            //     'role' => 'sometimes|required|string',
            //     'number' => 'sometimes|required|string',
            //     'age' => 'sometimes|required|integer',
            //     'password' => 'sometimes|nullable|string|min:8',
            //     'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            // ]);

            if ($request->hasFile('image')) {
                if ($user->image) {
                    Storage::disk('public')->delete($user->image);
                }
                $validatedData['image'] = $request->file('image')->store('profiles', 'public');
                $user->image = $validatedData['image'] ;
            }
            
        
            if (!empty($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            } else {
                unset($validatedData['password']);
            }
            $user->first_name = $validatedData['first_name'];
            $user->last_name = $validatedData['last_name'];
            $user->log_id = $validatedData['log_id'];
            $user->middle = $validatedData['middle'];
            $user->email = $validatedData['email'];
            $user->address = $validatedData['address'];
            $user->role = $validatedData['role'];
            $user->number = $validatedData['number'];
            $user->age = $validatedData['age'];
            $user->save();
            return response()->json([
                'message' => 'User updated successfully.',
                'user' => $user,
            ], 200);
    
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'User not found.',
                'message' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the user.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
/**
 * Delete a user by their ID.
 *
 * @param  int  $id
 * @return \Illuminate\Http\JsonResponse
 */
public function destroy($id)
{
    try {
      
        $user = User::findOrFail($id);

       
        $user->delete();

        
        return response()->json([
            'message' => 'User deleted successfully.'
        ], 200);

    } catch (\Exception $e) {
        
        return response()->json([
            'error' => 'An error occurred while deleting the user.',
            'message' => $e->getMessage()
        ], 500);
    }
}

}
