import { useQuery } from "@tanstack/react-query";
import { Banner, ButtonWrapper, InfoButton, Loader, Overview, PlayButton, SlidesText, SlidesWrap, Title, Wrapper } from "./Home";
import { getAiringToday, getDetailTv, getTvCredits, getTvOnTheAir, getTvPopular, getTvTopRated, IGetTvCredits, IGetDetailTv, IGetTv } from "../Api/TvApi";
import { makeImagePath } from "../Utils/Utils";
import Slides, { SlidesHandle } from "../Components/Slides";
import { useRef } from "react";
import { Info, Play } from "lucide-react";
import ContentModal from "../Components/ContentModal";
import { useSearchParams } from "react-router-dom";

const Tv = () => {

    const { data: airingTodayData, isLoading: isLoadingAiringToday } = useQuery<IGetTv>({
        queryKey: ["tv", "airingToday"],
        queryFn: getAiringToday,
    });

    const { data: onTheAirData, isLoading: isLoadingOnTheAir } = useQuery<IGetTv>({
        queryKey: ["tv", "onTheAir"],
        queryFn: getTvOnTheAir,
    });

    const { data: popularData, isLoading: isLoadingPopular } = useQuery<IGetTv>({
        queryKey: ["tv", "popular"],
        queryFn: getTvPopular,
    });

    const { data: topRatedData, isLoading: isLoadingTopRated } = useQuery<IGetTv>({
        queryKey: ["tv", "topRated"],
        queryFn: getTvTopRated,
    });

    const [movieIdParams] = useSearchParams();
    const movieId = Number(movieIdParams.get("movieId"));
    const airType = movieIdParams.get("type");
    const slidesModalRef = useRef<SlidesHandle>(null);

    const openModalFromOutside = (modalId: number, type: string) => {

        slidesModalRef.current?.onMovieInfoModal(modalId, type);
    };

    let dfModalData;
    if (movieId && airType) {

        switch (airType) {

            default:
            case "Banner":
            case "AiringToday":
                dfModalData = airingTodayData?.results.find(el => el.id === movieId);
                break;

            case "OnTheAir":
                dfModalData = onTheAirData?.results.find(el => el.id === movieId);
                break;

            case "Popular":
                dfModalData = popularData?.results.find(el => el.id === movieId);
                break;

            case "TopRated":
                dfModalData = topRatedData?.results.find(el => el.id === movieId);
                break;
        }
    }

    const { data: modalData } = useQuery<IGetDetailTv>({
        queryKey: ["tv", "detail"],
        queryFn: () => getDetailTv(movieId),
        enabled: !!movieId
    });

    const { data: creditData } = useQuery<IGetTvCredits>({
        queryKey: ["movies", "credits"],
        queryFn: () => getTvCredits(movieId),
        enabled: !!movieId
    });

    return (
        <Wrapper>
            {
                isLoadingAiringToday && isLoadingOnTheAir && isLoadingPopular && isLoadingTopRated
                    ? <Loader>Loading...</Loader>
                    : (
                        <>
                            <Banner
                                $bgPhoto={makeImagePath(airingTodayData?.results[0].backdrop_path || "")}
                            >
                                <Title>{airingTodayData?.results[0].original_name}</Title>
                                <Overview>{airingTodayData?.results[0].overview}</Overview>
                                <ButtonWrapper>
                                    <PlayButton onClick={() => openModalFromOutside(airingTodayData?.results[0].id as number, "Banner")}>
                                        <Play />
                                        재생
                                    </PlayButton>
                                    <InfoButton onClick={() => openModalFromOutside(airingTodayData?.results[0].id as number, "Banner")}>
                                        <Info />
                                        상세 정보
                                    </InfoButton>
                                </ButtonWrapper>
                            </Banner>
                            {
                                airingTodayData && (
                                    <SlidesWrap>
                                        <SlidesText>Airing Today</SlidesText>
                                        <Slides
                                            ref={slidesModalRef}
                                            data={airingTodayData as IGetTv}
                                            airType="AiringToday"
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
                                        <SlidesText>On The Air</SlidesText>
                                        <Slides
                                            ref={slidesModalRef}
                                            data={onTheAirData as IGetTv}
                                            airType="OnTheAir"
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
                                            data={popularData as IGetTv}
                                            airType="Popular"
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
                                        <SlidesText>Top Rated</SlidesText>
                                        <Slides
                                            ref={slidesModalRef}
                                            data={topRatedData as IGetTv}
                                            airType="TopRated"
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

export default Tv;