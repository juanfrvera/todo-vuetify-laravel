import axios, { AxiosRequestConfig } from "axios";

export class AuthService {
    private static readonly url: string = `${import.meta.env.VITE_API_URL}/auth`;
    private static readonly config: AxiosRequestConfig = { withCredentials: true, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } };
    private static userData?: { name: string };

    public static async loadCsrfToken() {
        const url: string = import.meta.env.VITE_CSRF_URL;

        await axios.get(url, this.config);
    }

    public static async register(data: { name: string; email: string; password: string; }) {
        // After registering, there is a cookie that is automatically added to each request
        const response = await axios.post(`${this.url}/register`, data, this.config);
        return response.data;
    }

    public static async logIn(data: { email: string; password: string }) {
        // After logging in, there is a cookie that is automatically added to each request
        const response = await axios.post<{ message: string; name: string; status: boolean; token: string }>(`${this.url}/login`, data, this.config);

        if (response.status === 200) {
            this.userData = { name: response.data.name };
        }

        return response.data;
    }

    public static getUserData() {
        return this.userData;
    }
}