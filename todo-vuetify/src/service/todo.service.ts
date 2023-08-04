import router from "@/router";
import axios from "axios";

export class TodoService {
    private readonly url: string = `${import.meta.env.VITE_API_URL}/todos`;
    private readonly headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

    public async createTodo(todo: { name: string }): Promise<ITodo> {
        const response = await axios.post(this.url, todo, { headers: this.headers, withCredentials: true });
        return response.data;
    }

    public async getAllTodos(): Promise<Array<ITodo>> {
        const response = await axios.get(this.url, { headers: this.headers, withCredentials: true });

        if (response.status === 401) {
            console.log("redirect to login");
            router.push('/login');
        }

        return response.data;
    }

    /**
     * Updates only given fields of todo
     * @param todo Please include the id and only changed properties
     * @returns updated todo
     */
    public async updateTodo(todo: { id: string } & Partial<ITodo>): Promise<ITodo> {
        const response = await axios.patch(`${this.url}/${todo.id}`, todo, { headers: this.headers, withCredentials: true });
        return response.data;
    }

    public async deleteTodo(id: string) {
        const response = await axios.delete(`${this.url}/${id}`, { headers: this.headers, withCredentials: true });
        return response.data;
    }
}

export interface ITodo {
    id: string;
    name: string;
    status: 'active' | 'done';
}