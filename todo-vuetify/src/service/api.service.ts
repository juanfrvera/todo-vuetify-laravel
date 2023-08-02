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
}

export interface ITodo {
    id: string;
    name: string;
}