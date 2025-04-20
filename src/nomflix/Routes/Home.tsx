import { useQuery } from "@tanstack/react-query";
import { getCredits, getDetailMovies, getMovies, getPopular, getTopRated, getUpcoming, IGetCredits, IGetDetailMovies, IGetMovies } from "../Api/MovieApi";
import styled from "styled-components";
import { makeImagePath } from "../Utils/Utils";
import { useSearchParams } from "react-router-dom";
import Slides, { SlidesHandle } from "../Components/Slides";
import { Info, Play } from "lucide-react";
import { useRef } from "react";
import ContentModal from "../Components/ContentModal";

export const Wrapper = styled.div`
    background: black;
`;

export const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Banner = styled.div<{ $bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.$bgPhoto});
    background-size: cover;
`;

export const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px; ;
`;

export const Overview = styled.p`
    font-size: 1.2vw;
    width: 50%;
    letter-spacing: 1px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, .45);
    line-height: normal;
    word-break: keep-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
`;

export const SlidesWrap = styled.div`
    position: relative;
    width: 100%;
    top: -100px;
`;

export const SlidesText = styled.p`
    font-size: 1.625rem;
    padding-left: 60px;
    margin-bottom: 1rem;
`;

export const ButtonWrapper = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 10px;

    svg {
        width: 1.8rem;
        height: 1.8rem;
    }
`;

export const BaseButton = styled.button`
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 1.25rem;
    border: none;
    border-radius: 4px;
    padding: .6rem 1.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
`;

export const PlayButton = styled(BaseButton)`
    background-color: white;
    color: black;

    svg {
        fill: black;
        margin-right: 0.5rem;
    }

    &:hover {
        background-color: #e5e5e5;
    }
`;

export const InfoButton = styled(BaseButton)`
    background-color: rgba(109, 109, 110, 0.7);
    color: white;

    svg {
        margin-right: 0.5rem;
    }

    &:hover {
        background-color: rgba(109, 109, 110, 0.4);
    }
`;

const Home = () => {

    const { data, isLoading } = useQuery<IGetMovies>({
        queryKey: ["movies", "nowPlaying"],
        queryFn: getMovies,
    });

    const { data: topRatedData, isLoading: isLoadingTopRated } = useQuery<IGetMovies>({
        queryKey: ["movies", "topRated"],
        queryFn: getTopRated,
    });

    const { data: popularData, isLoading: isLoadingPopular } = useQuery<IGetMovies>({
        queryKey: ["movies", "popular"],
        queryFn: getPopular,
    });

    const { data: upcomingData, isLoading: isLoadingUpcoming } = useQuery<IGetMovies>({
        queryKey: ["movies", "upcoming"],
        queryFn: getUpcoming,
    });

    const [movieIdParams] = useSearchParams();
    const movieId = Number(movieIdParams.get("movieId"));
    const airType = movieIdParams.get("type");
    const slidesModalRef = useRef<SlidesHandle>(null);

    let dfModalData;
    if (movieId && airType) {

        switch (airType) {

            default:
            case "Banner":
            case "NowPlaying":
                dfModalData = data?.results.find(el => el.id === movieId);
                break;

            case "HighRated":
                dfModalData = topRatedData?.results.find(el => el.id === movieId);
                break;

            case "Popular":
                dfModalData = popularData?.results.find(el => el.id === movieId);
                break;

            case "Upcoming":
                dfModalData = upcomingData?.results.find(el => el.id === movieId);
                break;
        }
    }

    const { data: modalData } = useQuery<IGetDetailMovies>({
        queryKey: ["movies", "detail"],
        queryFn: () => getDetailMovies(movieId),
        enabled: !!movieId
    });

    const { data: creditData } = useQuery<IGetCredits>({
        queryKey: ["movies", "credits"],
        queryFn: () => getCredits(movieId),
        enabled: !!movieId
    });

    const openModalFromOutside = (modalId: number, type: string) => {

        slidesModalRef.current?.onMovieInfoModal(modalId, type);
    };

    return (
        <Wrapper>
            {
                isLoading && isLoadingTopRated && isLoadingPopular && isLoadingUpcoming
                    ? <Loader>Loading...</Loader>
                    : (
                        <>
                            <Banner
                                $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                            >
                                <Title>{data?.results[0].original_title}</Title>
                                <Overview>{data?.results[0].overview}</Overview>
                                <ButtonWrapper>
                                    <PlayButton onClick={() => openModalFromOutside(data?.results[0].id as number, "Banner")}>
                                        <Play />
                                        재생
                                    </PlayButton>
                                    <InfoButton onClick={() => openModalFromOutside(data?.results[0].id as number, "Banner")}>
                                        <Info />
                                        상세 정보
                                    </InfoButton>
                                </ButtonWrapper>
                            </Banner>
                            {
                                data && (
                                    <SlidesWrap>
                                        <SlidesText>Now Playing</SlidesText>
                                        <Slides
                                            ref={slidesModalRef}
                                            data={data}
                                            airType="NowPlaying"
                                        />
                                    </SlidesWrap>
                                )
                            }
                            {
                                topRatedData && (
                                    <SlidesWrap
                                        style={{
                                            marginTop: "40px"
                                        }}
                                    >
                                        <SlidesText>High Rated</SlidesText>
                                        <Slides
                                            ref={slidesModalRef}
                                            data={topRatedData as IGetMovies}
                                            airType="HighRated"
                                        />
                                    </SlidesWrap>
                                )
                            }
                            {
                                popularData && (
                                    <SlidesWrap
                                        style={{
                                            marginTop: "40px"
                                        }}
                                    >
                                        <SlidesText>Popular</SlidesText>
                                        <Slides
                                            ref={slidesModalRef}
                                            data={popularData as IGetMovies}
                                            airType="Popular"
                                        />
                                    </SlidesWrap>
                                )
                            }
                            {
                                upcomingData && (
                                    <SlidesWrap
                                        style={{
                                            marginTop: "40px"
                                        }}
                                    >
                                        <SlidesText>Upcoming</SlidesText>
                                        <Slides
                                            ref={slidesModalRef}
                                            data={upcomingData as IGetMovies}
                                            airType="Upcoming"
                                        />
                                    </SlidesWrap>
                                )
                            }
                            {
                                (modalData && dfModalData && creditData) &&
                                <ContentModal
                                    modalData={modalData}
                                    dfModalData={dfModalData}
                                    creditData={creditData}
                                    isSearch={false}
                                />
                            }
                        </>
                    )
            }
        </Wrapper>
    );
}

export default Home;