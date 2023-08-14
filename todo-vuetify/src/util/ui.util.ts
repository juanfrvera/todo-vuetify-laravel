import { AxiosError } from "axios";

export function getErrorString(error) {
    console.log(error);
    if (error instanceof AxiosError) {
        if (error?.response?.data?.message) {
            return error.response.data.message;
        }
    }
    return 'An unexpected error occurred, please try again later';
}