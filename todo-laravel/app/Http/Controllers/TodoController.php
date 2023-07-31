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

    public function update(Request $request, $id)
    {
        if(Todos::where('id', $id)->exists()){
            $todo = Todos::find($id);
            $todo->name = is_null($request->name) ? $todo->name : $request->name;
            $todo->description = is_null($request->description) ? $todo->description : $request->description;
            $todo->status = is_null($request->status) ? $todo->status : $request->status;

            $todo->save();

            return response()->json([
                "message" => "Todo Updated."
            ], 200);
        } else {
            return response()->json([
                "message" => "Todo Not Found."
            ], 404);
        }
    }

    public function delete($id)
    {
        if(Todos::where('id', $id)->exists()){
            $todo = Todos::find($id);

            $todo->delete();
            return response()->json([
                "message" => "Todo deleted."
            ], 202);
        } else{
            return response()->json([
                "message" => "Todo Not Found."
            ], 404);
        }
    }
}
