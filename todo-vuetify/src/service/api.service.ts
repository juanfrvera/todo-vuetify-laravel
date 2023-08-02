export class ApiService {
    private readonly url: string = import.meta.env.VITE_API_URL;
    private readonly headers = { 'Content-Type': 'application/json' };

    public async createTodo(todo: { name: string }): Promise<ITodo> {
        const response = await fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(todo),
        });

        return response.json();
    }

    public async getAllTodos(): Promise<Array<ITodo>> {
        const response = await fetch(this.url, {
            method: 'GET',
            headers: this.headers,
        });

        return response.json();
    }

    /**
     * Updates only given fields of todo
     * @param todo Please include the id and only changed properties
     * @returns updated todo
     */
    public async updateTodo(todo: { id: string } & Partial<ITodo>): Promise<ITodo> {
        const response = await fetch(`${this.url}/${todo.id}`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(todo)
        });

        return response.json();
    }

    public async deleteTodo(id: string) {
        const response = await fetch(`${this.url}/${id}`, {
            method: 'DELETE',
            headers: this.headers,
        });

        return response.json();
    }
}

export interface ITodo {
    id: string;
    name: string;
    status: 'active' | 'done';
}