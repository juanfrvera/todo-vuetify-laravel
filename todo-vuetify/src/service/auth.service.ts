import axios from "axios";

export class AuthService {
    private readonly url: string = `${import.meta.env.VITE_API_URL}/auth`;
    private readonly headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

    public async getCsrfToken() {
        const url: string = import.meta.env.VITE_CSRF_URL;
        const response = await axios.get(url, { withCredentials: true, headers: this.headers });

        console.log(response);
    }

    public async register(data: IRegisterData) {
        const response = await axios.post(`${this.url}/register`, data, { headers: this.headers, withCredentials: true });

        const result = response.data;

        return result;
    }
}

export interface IRegisterData {
    name: string; email: string; password: string;
}