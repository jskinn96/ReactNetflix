import axios from "axios";

export const ApiKey = "41174b29f1c31143c31f5283b534e5b2";
export const Path = "https://api.themoviedb.org/3";

export type TGetMoviesResults = {
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
};

export interface IGetMovies {
    dates: {
        maximum: string;
        minimum: string;
    }
    page: number;
    results: TGetMoviesResults[];
    total_pages: number;
    total_results: number;
}

export const getMovies = async () => {

    try {

        const res = await axios.get(`${Path}/movie/now_playing?api_key=${ApiKey}&language=en`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
    }
}

export const getTopRated = async () => {

    try {

        const res = await axios.get(`${Path}/movie/top_rated?api_key=${ApiKey}&language=en`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
        throw new Error("Failed to fetch top rated");
    }
}

export const getPopular = async () => {

    try {

        const res = await axios.get(`${Path}/movie/popular?api_key=${ApiKey}&language=en`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
        throw new Error("Failed to fetch popular");
    }
}

export const getUpcoming = async () => {

    try {

        const res = await axios.get(`${Path}/movie/upcoming?api_key=${ApiKey}&language=en`);
        const data = res.data;

        return data;

    } catch (error) {

        console.error(error);
        throw new Error("Failed to fetch upcoming");
    }
}

export type IGetDetailMoviesGenres = {
    id: number;
    name: string;
}
export interface IGetDetailMovies {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: unknown;
    budget: number;
    genres: IGetDetailMoviesGenres[];
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

export const getDetailMovies = async (movieId: number) => {

    try {

        const res = await axios.get(`${Path}/movie/${movieId}?api_key=${ApiKey}`);
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

export interface IGetCredits {
    cast: TGetCreditsCast[];
    crew: TGetCreditsCrew[];
}

export const getCredits = async (movieId: number) => {

    try {

        const res = await axios.get(`${Path}/movie/${movieId}/credits?api_key=${ApiKey}&language=en`);
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