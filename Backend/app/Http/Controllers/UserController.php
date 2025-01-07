<?php

namespace App\Http\Controllers;

use App\Mail\VerificationEmail;
use App\Mail\WelcomeEmail;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use App\Mail\ResetPasswordEmail;
use App\Mail\ResetPasswordsuccess;
class UserController extends Controller
{
    public function signup(Request $request)
    {
        $data = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:10',
        ]);
        if ($data->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $data->errors(),
            ], 422);
        }
        $validatedData = $data->validated();
        $verificationToken = (string) random_int(100000, 999999);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'verificationToken' => $verificationToken,
            'verificationTokenExpiresAt' => Carbon::now()->addHours(24)
        ]);
        $token = $user->createToken('accesstoken')->plainTextToken;

        try {
            Mail::to('aymanejouda5@gmail.com')->send(new VerificationEmail($verificationToken));
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'User created, but email verification failed.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'user' => $user->makeHidden('password',
            'verificationToken','verificationTokenExpiresAt','resetPasswordToken','resetPasswordExpiresAt'),
            'message' => 'User created successfully.',
            'token' => $token,
        ])->cookie('accesstoken', $token, 8640, '/', null, false, true, false,'Lax');
    }
    public function login(Request $request)
    {
        $data = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($data->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $data->errors(),
            ], 422);
        }

        $validatedData = $data->validated();

        $user = User::where('email', $validatedData['email'])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        if (!Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials.',
            ], 401);
        }

        if (!$user->isVerified) {
            return response()->json([
                'success' => false,
                'message' => 'Please verify your email first.',
            ], 400);
        }

        $token = $user->createToken('accesstoken')->plainTextToken;
        $user->lastlogin = Carbon::now();
        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'user' => $user->makeHidden('password','verificationToken',
            'verificationTokenExpiresAt','resetPasswordToken','resetPasswordExpiresAt'), 
            'token' => $token,
        ])->cookie('accesstoken', $token, 8640);
    }
    
    public function verifyemail(Request $request)
    {
        $token = $request->code;

        $user = User::where('verificationToken', $token)
            ->where('verificationTokenExpiresAt', '>=', now())
            ->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'invalid or expired token'], 400);
        }
        $user->isVerified = true;
        $user->verificationToken = null;
        $user->verificationTokenExpiresAt = null;
        $user->save();
        try {
            Mail::to('aymanejouda5@gmail.com')->send(new WelcomeEmail($user->name, $user->email));
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => '  welcome email sent  failed.',
            ], 500);
        }
        return response()->json([
            'success' => true,
            'user' => $user->makeHidden('password','resetPasswordToken','resetPasswordExpiresAt'),
            'message' => 'Email verified successfully',
        ]);
    }
    public function logoutt(Request $request)
    {
        $request->user()->tokens()->delete();
        Cookie::queue(Cookie::forget('accesstoken'));

        return response()->json(['success' => true, 'message' => 'Logged out successfully'])
        ->cookie('accesstoken', '');
    }
    public function forogotpassword(Request $request)
    {
        $email = $request->email;
        $user = User::where('email', $email)->first();
      
        $resettoken =  bin2hex(random_bytes(6));
        $resettokenexpiresat = now()->addMinutes(6);
        $user->resetPasswordToken = $resettoken;
        $user->resetPasswordExpiresAt = $resettokenexpiresat;
        $user->save();
        try {
            Mail::to('aymanejouda5@gmail.com')->send(new ResetPasswordEmail('http://localhost:5173/reset-password/' . $resettoken));
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => '  reset password email sent  failed.',
            ], 500);
        }
        return response()->json([
            'success' => true,
            'message' => 'Password reset link sent to your email',
        ], 200);
    }
    public function resetpassword(Request $request, $passtoken)
    {
        $paswword = $request->password;
        $user = User::where('resetPasswordToken', $passtoken)
        ->where('resetPasswordExpiresAt', '>', now())->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'errors' => 'invalid or expired token'
            ], 400);
        }
        try{
            Mail::to('aymanejouda5@gmail.com')->send(new ResetPasswordsuccess());

        }
        catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'password reset email sent failed',
            ],500);
        }
        $user->password = bcrypt($paswword);
        $user->resetPasswordToken = null;
        $user->resetPasswordExpiresAt = null;
        $user->save();
       
        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully',
        ], 200);
    }
    public function authcheck (Request $request){
        $user=$request->user();
        return response()->json([
            'success' => true,
          'user'=>  $user],200);
    }
    public function ResendverifyEmail(Request $request){
        $email=$request->email;
        $user=User::where('email',$email)->first();
        if($user->isVerified){
            return response()->json([
                'success' => false,
                'message' => 'Your email is already verified',
                ], 400);
                
        }
        $verificationToken = (string) random_int(100000, 999999);
        $user->verificationToken = $verificationToken;
        try {
            Mail::to('aymanejouda5@gmail.com')->send(new VerificationEmail($verificationToken));
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'User created, but email verification failed.',
            ], 500);
        }
        $user->save();
        return response()->json([
            'success' => true,
            'message' => 'Verification email sent successfully',
            ], 200);
    }
}