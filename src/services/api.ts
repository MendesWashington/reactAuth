import axios from "axios";


const token = localStorage.getItem("@authReact-token") || "";

export const api = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
        Authorization: `Bearer ${token}`
    }
})