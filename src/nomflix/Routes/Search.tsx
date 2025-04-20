import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getMovieKeyword, getTvKeyword, IMovieKeyword, ITvKeyword } from "../Api/Search";
import styled from "styled-components";
import { makeImagePath } from "../Utils/Utils";
import { motion } from "framer-motion";
import { getCredits, getDetailMovies, IGetCredits, IGetDetailMovies } from "../Api/MovieApi";
import { getDetailTv, getTvCredits, IGetDetailTv, IGetTvCredits } from "../Api/TvApi";
import ContentModal from "../Components/ContentModal";

const Wrapper = styled.div`
    position: relative;
    padding: 60px;
    margin-top: 65px;
    display: flex;
    flex-direction: column;
    gap: 50px;
`;

const KeywordTitle = styled.h1`
    font-size: 20px;
    color: rgb(128, 128, 128);

    span {
        color: #fff;
    }
`;

const CotentsWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ContentsTitle = styled.h2`
    font-size: 25px;
    font-weight: 500;
    color: rgb(229, 229, 229);
    display: flex;
    align-items: center;

    span {
        margin-right: 3px;
    }
`;

const ContentsLine = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
`;

const Contents = styled(motion.div) <{ $bgPhoto: string }>`
    border-radius: 4px;
    background-image: url(${(props) => props.$bgPhoto});
    background-size: cover;
    background-position: center center;
    cursor: pointer;
    padding: 28.125% 0;
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${({ theme }) => theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 13px;
    }
`;

const ContentsVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -30,
        transition: {
            delay: .5,
            duration: .1,
            type: "tween"
        }
    }
}

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    },
};

const Search = () => {

    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const infoNavi = useNavigate();
    const [searchParams] = useSearchParams();
    const contentsId = Number(searchParams.get("movieId"));
    const airType = searchParams.get("type");

    const { data: movieKeywordData, isLoading: isLoadingMovie } = useQuery<IMovieKeyword>({
        queryKey: ["movies", "keyword", keyword],
        queryFn: () => getMovieKeyword(keyword as string),
        enabled: !!keyword,
    });

    const { data: tvKeywordData, isLoading: isLoadingTv } = useQuery<ITvKeyword>({
        queryKey: ["tv", "keyword", keyword],
        queryFn: () => getTvKeyword(keyword as string),
        enabled: !!keyword,
    });

    const { data: movieModalData } = useQuery<IGetDetailMovies>({
        queryKey: ["movies", "detail", keyword],
        queryFn: () => getDetailMovies(contentsId),
        enabled: airType === "movie" && !!contentsId,
    });

    const { data: movieCreditData } = useQuery<IGetCredits>({
        queryKey: ["movies", "credits", keyword],
        queryFn: () => getCredits(contentsId),
        enabled: airType === "movie" && !!contentsId,
    });

    const { data: tvModalData } = useQuery<IGetDetailTv>({
        queryKey: ["tv", "detail", keyword],
        queryFn: () => getDetailTv(contentsId),
        enabled: airType === "tv" && !!contentsId,
    });

    const { data: tvCreditData } = useQuery<IGetTvCredits>({
        queryKey: ["tv", "credits", keyword],
        queryFn: () => getTvCredits(contentsId),
        enabled: airType === "tv" && !!contentsId,
    });

    const modalData = airType === "movie" ? movieModalData : tvModalData;
    const creditData = airType === "movie" ? movieCreditData : tvCreditData;
    const dfModalData = airType === "movie"
        ? movieKeywordData?.results.find(el => el.id === contentsId)
        : tvKeywordData?.results.find(el => el.id === contentsId);

    const onInfoModal = (cid: number, type: string) => {

        infoNavi(`?keyword=${keyword}&movieId=${cid}&type=${type}`);
    }

    return (
        <Wrapper>
            <KeywordTitle>Result of searching with <span>{keyword}</span></KeywordTitle>
            {
                (!isLoadingMovie && movieKeywordData) &&
                <CotentsWrap>
                    <ContentsTitle>
                        <span
                            style={{
                                marginBottom: "6px"
                            }}
                        >📽️</span>
                        Movie
                    </ContentsTitle>
                    <ContentsLine>
                        {
                            movieKeywordData.results.map((el) => {

                                const bg = el.backdrop_path
                                    ? makeImagePath(el.backdrop_path, "w500")
                                    : "https://placehold.co/500x500/2F2F2F/ffffff?text=No+Image";

                                return (
                                    <Contents
                                        key={el.id}
                                        layoutId={`${el.id}_${airType}_${keyword}`}
                                        $bgPhoto={bg}
                                        whileHover="hover"
                                        initial="normal"
                                        transition={{ type: "tween" }}
                                        variants={ContentsVariants}
                                        onClick={() => onInfoModal(el.id, "movie")}
                                    >
                                        <Info variants={infoVariants}>
                                            <h4>{el.title}</h4>
                                        </Info>
                                    </Contents>
                                );
                            })
                        }
                    </ContentsLine>
                </CotentsWrap>
            }
            {
                (!isLoadingTv && tvKeywordData) &&
                <CotentsWrap>
                    <ContentsTitle>
                        <span>📺</span>
                        Series
                    </ContentsTitle>
                    <ContentsLine>
                        {
                            tvKeywordData.results.map((el) => {

                                const bg = el.backdrop_path
                                    ? makeImagePath(el.backdrop_path, "w500")
                                    : "https://placehold.co/500x500/2F2F2F/ffffff?text=No+Image";

                                return (
                                    <Contents
                                        key={el.id}
                                        layoutId={`${el.id}_${airType}`}
                                        $bgPhoto={bg}
                                        whileHover="hover"
                                        initial="normal"
                                        transition={{ type: "tween" }}
                                        variants={ContentsVariants}
                                        onClick={() => onInfoModal(el.id, "tv")}
                                    >
                                        <Info variants={infoVariants}>
                                            <h4>{el.name}</h4>
                                        </Info>
                                    </Contents>
                                );
                            })
                        }
                    </ContentsLine>
                </CotentsWrap>
            }
            {
                (modalData && dfModalData && creditData) &&
                <ContentModal
                    modalData={modalData}
                    dfModalData={dfModalData}
                    creditData={creditData}
                    isSearch={true}
                />
            }
        </Wrapper>
    );
}

export default Search;