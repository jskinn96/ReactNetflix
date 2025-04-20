import axios from "axios";
import { ApiKey, Path } from "./MovieApi";

export type TMovieKeywordResults = {
    adult: boolean;
    backdrop_path: string | undefined;
    genre_ids: [];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface IMovieKeyword {
    page: number;
    results: TMovieKeywordResults[];
    total_pages: number;
    total_results: number;
}

export const getMovieKeyword = async (keyword: string) => {

    try {

        const res = await axios.get(`${Path}/search/movie?api_key=${ApiKey}&query=${keyword}`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
    }
}

export type TTvKeywordResults = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: [];
    id: number;
    origin_country: [];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    first_air_date: string;
    name: string;
    vote_average: number;
    vote_count: number;
}

export interface ITvKeyword {
    page: number;
    results: TTvKeywordResults[];
    total_pages: number;
    total_results: number;
}

export const getTvKeyword = async (keyword: string) => {

    try {

        const res = await axios.get(`${Path}/search/tv?api_key=${ApiKey}&query=${keyword}`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
    }
}