import axios from "axios";
import { mock } from "./mock";

const perPage = 10;
const timeout = 1000;
export const fetchTodos = async (page: number) => {
    try {
        const { data } = await api.get('/movie/popular?api_key=1c37e636b11ba605ccd7257aac891e48&language=en-US&page=' + page);
        return data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         const initial = perPage * page;
    //         const final = perPage;

    //         const filtered = mock.filter((el: any, index: number) => {
    //             return index >= initial && index < final;
    //         });

    //         return resolve({
    //             itens: filtered,
    //             page,
    //             totalPages: mock.length / perPage,
    //         });
    //     }, timeout);
    // });
};

export const fetchSearch = async (search: string, page: number) => {
    try {
        const { data } = await api.get("/search/movie?api_key=1c37e636b11ba605ccd7257aac891e48&language=en-US&query=" + search + "&page=" + page);
        return data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
};

export const fetchFilme = async (filmeId: number) => {
    try {
        const { data } = await api.get("/movie/" + filmeId + "?api_key=1c37e636b11ba605ccd7257aac891e48");
        return data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
};

export const fetchCredits = async (filmeId: number) => {
    try {
        const { data } = await api.get("/movie/" + filmeId + "/credits?api_key=1c37e636b11ba605ccd7257aac891e48");
        return data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
};

export const fetchListaRecomendacoes = async (filmeId: number) => {
    try {
        const { data } = await api.get("/movie/" + filmeId + "/recommendations?api_key=1c37e636b11ba605ccd7257aac891e48");
        return data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
};

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
});

export default api;