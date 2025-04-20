import axios from "axios";
import { ApiKey, Path } from "./MovieApi";

export type TGetTvResults = {
    adult: boolean;
    backdrop_path: string | undefined;
    genre_ids: number[];
    id: number;
    origin_country: string[];
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

export interface IGetTv {
    page: number;
    results: TGetTvResults[];
    total_pages: number;
    total_results: number;
}

export const getAiringToday = async () => {

    try {

        const res = await axios.get(`${Path}/tv/airing_today?api_key=${ApiKey}`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
    }
}

export const getTvOnTheAir = async () => {

    try {

        const res = await axios.get(`${Path}/tv/on_the_air?api_key=${ApiKey}`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
    }
}

export const getTvPopular = async () => {

    try {

        const res = await axios.get(`${Path}/tv/popular?api_key=${ApiKey}`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
    }
}

export const getTvTopRated = async () => {

    try {

        const res = await axios.get(`${Path}/tv/top_rated?api_key=${ApiKey}`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
    }
}

export type TGetDetailTvGenres = {
    id: number;
    name: string;
}
export interface IGetDetailTv {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: unknown;
    budget: number;
    genres: TGetDetailTvGenres[];
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: [];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: unknown;
    production_countries: unknown;
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: unknown;
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export const getDetailTv = async (movieId: number) => {

    try {

        const res = await axios.get(`${Path}/tv/${movieId}?api_key=${ApiKey}`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
    }
}

export type TGetCreditsCast = {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    credit_id: string;
    department: string;
    job: string;
}

export type TGetCreditsCrew = {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    credit_id: string;
    department: string;
    job: string;
}

export interface IGetTvCredits {
    cast: TGetCreditsCast[];
    crew: TGetCreditsCrew[];
}

export const getTvCredits = async (movieId: number) => {

    try {

        const res = await axios.get(`${Path}/tv/${movieId}/credits?api_key=${ApiKey}&language=en`);
        const data = res.data;

        const returnData = {
            cast: data.cast.slice(0, 5),
            crew: data.crew.slice(0, 5),
        }

        return returnData;

    } catch (error) {

        console.error(error);
        throw new Error("Failed to fetch credits");
    }
}