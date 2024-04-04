<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Requests\FeedBackRequest;
use App\Models\FeedBack;
use App\Models\FeedBackComments;
use App\Models\User;
use Illuminate\Http\Request;

class FeedBackController extends BaseController
{

    public function list(Request $request)
    {
        $feedbacks = FeedBack::with(['user','comments'])->paginate(10);
        return $this->sendResponse($feedbacks, 'FeedBacks retrieved successfully');
    }
    public function save(FeedBackRequest $request)
    {

        $feedback = FeedBack::create([
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
            'user_id' => $request->user()->id,
        ]);

       return $this->sendResponse($feedback, 'FeedBack saved successfully');
    }

    public function saveReply(Request $request)
    {
        $feedback = FeedBackComments::create([
            'comment' => $request->comment,
            'feedback_id' => $request->feedback_id,
            'user_id' => $request->user()->id,
        ]);

        return $this->sendResponse($feedback, 'Comment saved successfully');
    }

    public function fetchUsers(Request $request)
    {
        $users = User::where('name','like', '%' . $request->search.'%')->get();
        return $this->sendResponse($users, 'Comment saved successfully');
    }
}
