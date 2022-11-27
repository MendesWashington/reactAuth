import axios, { AxiosError } from "axios";



interface ErrorResponse extends AxiosError {
    code?: string;
}

interface IfailedRequestsQueueProps {
    onSuccess: (token: string) => void;

    onFailure: (error: AxiosError) => void;
}

let token = localStorage.getItem("@authReact-token");
let isRefreshing = false;
let failedRequestsQueue: IfailedRequestsQueueProps[] = [];


export const api = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
        Authorization: `Bearer ${token}`
    }
})

function signOut() {
    localStorage.removeItem("@authReact:token");
    localStorage.removeItem("@authReact:refresh-token");
    //redirecionar
    
}

api.interceptors.response.use((response) => {
    return response
}, (error: AxiosError<ErrorResponse>) => {

    if (error.response?.status === 401) {
        if (error.code === '') {
            //renovar token
            const refreshToken = localStorage.getItem("@authReact-refresh-token");
            const originalConfig = error.config;
            if (!isRefreshing) {
                isRefreshing = true;

                api.post('/refresh', {
                    refreshToken
                }).then(response => {
                    localStorage.setItem("@authReact:token", response.data?.token);
                    localStorage.setItem("@authReact:refresh-token", response.data?.refreshToken);
                    const newToken = `Bearer ${response.data?.token}`;

                    api.defaults.headers.common["Authorization"] = newToken;

                    failedRequestsQueue.forEach(request => request.onSuccess(newToken));
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