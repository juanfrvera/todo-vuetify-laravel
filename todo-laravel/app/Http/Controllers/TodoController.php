<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Todos;

class TodoController extends Controller
{
    public function getAll()
    {
        $todos = Todos::all();
        return response()->json($todos);
    }

    public function store(Request $request)
    {
        $todo = new Todos;
        $todo->name = $request->name;
        $todo->description = $request->description;
        $todo->status = 'active';

        $todo->save();

        return response()->json([
            "message" => "Todo added."
        ], 201);
    }
}
