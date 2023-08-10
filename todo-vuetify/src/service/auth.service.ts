import axios, { AxiosRequestConfig } from "axios";

export class AuthService {
    private readonly url: string = `${import.meta.env.VITE_API_URL}/auth`;
    private readonly config: AxiosRequestConfig = { withCredentials: true, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } };

    public async loadCsrfToken() {
        const url: string = import.meta.env.VITE_CSRF_URL;

        await axios.get(url, this.config);
    }

    public async register(data: { name: string; email: string; password: string; }) {
        // After registering, there is a cookie that is automatically added to each request
        const response = await axios.post(`${this.url}/register`, data, this.config);
        return response.data;
    }

    public async logIn(data: { email: string; password: string }) {
        // After logging in, there is a cookie that is automatically added to each request
        const response = await axios.post(`${this.url}/login`, data, this.config);
        return response.data;
    }
}