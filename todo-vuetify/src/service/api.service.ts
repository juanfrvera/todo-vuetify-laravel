export class ApiService {
    private readonly url: string = import.meta.env.VITE_API_URL;

    public async createTodo(todo: { name: string }): Promise<ITodo> {
        console.log(this.url);
        const response = await fetch(this.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });

        return response.json();
    }
}

export interface ITodo {
    id: string;
    name: string;
}