import axios, { AxiosError } from "axios";

import { useHistory } from "react-router-dom";


interface ErrorResponse extends AxiosError {
    code?: string;
}

interface IfailedRequestsQueueProps {
    onSuccess: (token: string) => void;

    onFailure: (error: AxiosError) => void;
}

let token = localStorage.getItem("@authReact:token");
let isRefreshing = false;
let failedRequestsQueue: IfailedRequestsQueueProps[] = [];

export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${token}`
    }
})

function signOut() {
    localStorage.removeItem("@authReact:token");
    localStorage.removeItem("@authReact:refresh-token");
    //redirecionar
    const history = useHistory();

    history.push("/");
}

api.interceptors.response.use((response) => {
    return response
}, (error: AxiosError<ErrorResponse>) => {

    if (error.response?.status === 401) {
        console.log(error.response.data?.code)
        if (error.response.data?.code === 'token.expired') {
            //renovar token
            const refreshToken = localStorage.getItem("@authReact:refresh-token");
            const originalConfig = error.config;
            if (!isRefreshing) {
                isRefreshing = true;

                api.post('/refresh', {
                    refreshToken
                }).then(response => {
                    const {
                        token,
                        refreshToken,
                    } = response.data;
                    localStorage.setItem("@authReact:token", token);
                    localStorage.setItem("@authReact:refresh-token", refreshToken);

                    api.defaults.headers.common["Authorization"] = token;

                    failedRequestsQueue.forEach(request => request.onSuccess(token));
                    failedRequestsQueue = [];
                }).catch(error => {
                    failedRequestsQueue.forEach(request => request.onFailure(error))
                    failedRequestsQueue = [];
                }).finally(() => {
                    isRefreshing = false;
                })
            }
            return new Promise((resolve, reject) => {
                failedRequestsQueue.push({
                    onSuccess: (token: string) => {
                        if (originalConfig.headers != null) {
                            console.log(originalConfig)
                            originalConfig.headers.Authorization = `Bearer ${token}`;
                        }
                        resolve(api(originalConfig))

                    },
                    onFailure: (error: AxiosError) => {
                        reject(error);
                    }
                })
            });
        } else {
            //Deslogar usuário
            signOut();
        }
    }

    return Promise.reject(error)
})