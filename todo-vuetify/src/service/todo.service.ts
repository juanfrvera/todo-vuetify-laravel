import router from "@/router";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export class TodoService {
    private readonly url: string = `${import.meta.env.VITE_API_URL}/todos`;
    private readonly config: AxiosRequestConfig = { withCredentials: true, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } };


    public createTodo(todo: { name: string }): Promise<ITodo> {
        return this.callAndCatchErrors(() => axios.post(this.url, todo, this.config));
    }

    public getAllTodos(): Promise<Array<ITodo>> {
        return this.callAndCatchErrors(() => axios.get(this.url, this.config));
    }

    /**
     * Updates only given fields of todo
     * @param todo Please include id and only changed properties
     * @returns updated todo
     */
    public updateTodo(todo: { id: string } & Partial<ITodo>): Promise<ITodo> {
        return this.callAndCatchErrors(() => axios.patch(`${this.url}/${todo.id}`, todo, this.config));
    }

    public deleteTodo(id: string) {
        return this.callAndCatchErrors(() => axios.delete(`${this.url}/${id}`, this.config));
    }

    private async callAndCatchErrors(request: () => Promise<AxiosResponse>) {
        try {
            const response = await request();
            return response.data;
        } catch (error) {
            this.redirectIfNoAuth(error);
            throw error;
        }
    }

    private redirectIfNoAuth(error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.status === 401) {
                router.push('/login');
            }
        }
    }
}

export interface ITodo {
    id: string;
    name: string;
    status: 'active' | 'done';
}