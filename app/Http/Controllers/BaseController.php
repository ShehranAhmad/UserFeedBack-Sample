<?php

namespace App\Http\Controllers;

//use Illuminate\Http\Request;
use InfyOm\Generator\Utils\ResponseUtil;

class BaseController extends Controller
{
    public function sendCustomResponse($result, $message, $status = 200): \Illuminate\Http\JsonResponse
    {
        $response = [
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ];
        return response()->json($response, $status);
    }
    public function sendCustomErrorResponse($result, $status = 400): \Illuminate\Http\JsonResponse
    {
        $response = [
            'success' => false,
            'data'    => $result,
        ];
        return response()->json([$response], $status);
    }
    public function sendResponse($result, $message): \Illuminate\Http\JsonResponse
    {
        $res =[
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ];
        return response()->json($res);
    }
    public function sendError($error, $code = 404): \Illuminate\Http\JsonResponse
    {
        $res = [
            'success' => false,
            'message' => $error,
        ];

        if (!empty($data)) {
            $res['data'] = $data;
        }
        return response()->json($res, $code);
    }
    public function sendSuccess($message): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message
        ], 200);
    }
}
