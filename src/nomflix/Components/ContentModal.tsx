import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeImagePath } from "../Utils/Utils";
import styled from "styled-components";
import { Star, X } from "lucide-react";
import { IGetCredits, IGetDetailMovies, TGetMoviesResults } from "../Api/MovieApi";
import { IGetDetailTv, IGetTvCredits, TGetTvResults } from "../Api/TvApi";

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    opacity: 0;
    z-index: 1;
`;

const BigMovie = styled(motion.div)`
    position: fixed;
    width: 50vw;
    height: 95vh;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.darker};
    z-index: 1;
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    padding-top: 56.3925%;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 36px;
    font-weight: bold;
    position: relative;
    top: -80px;
`;

const ModalContentWrap = styled.div`
    padding: 20px;
    position: relative;
    top: -80px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const MovieInfoWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.25rem;
`;

const MovieYear = styled.span`
    color: #bcbcbc;
`;

const MovieRates = styled.span`
    display: flex;
    align-items: center;
    gap: 5px;
    svg {
        color: rgb(252 213 63);
    }
`;

const ModalContentLine = styled.div`
    display: flex;
    gap: 20px;
`;

const BigOverview = styled.div`
    color: ${(props) => props.theme.white.lighter};
    line-height: normal;
    flex: 0 0 60%;
`;

const MovieAttendeesLine = styled.div`
    line-height: normal;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MovieAttendees = styled.div`
`;

const MovieAttendeesTitle = styled.span`
    color: #777;
    margin-right: 3px;
`;

const ModalCloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background-color: rgba(0, 0, 0, 0.75);
    border: none;
    border-radius: 9999px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
    }

    svg {
        color: white;
        width: 20px;
        height: 20px;
    }
`;

const ContentModal = ({ modalData, dfModalData, creditData, isSearch = false }: { modalData: IGetDetailMovies | IGetDetailTv, dfModalData: TGetMoviesResults | TGetTvResults, creditData: IGetCredits | IGetTvCredits, isSearch: boolean }) => {

    const movieNavi = useNavigate();
    const [movieIdParams] = useSearchParams();
    const movieId = Number(movieIdParams.get("movieId"));
    const keyword = movieIdParams.get("keyword");
    const airType = movieIdParams.get("type");

    const onOverlayClick = !isSearch
        ? () => movieNavi("")
        : () => movieNavi(`?keyword=${keyword}`);

    const LayoutId = !isSearch
        ? `${movieId}_${airType}`
        : `${movieId}_${airType}_${keyword}`;


    return (
        <AnimatePresence>
            {movieId ? (
                <>
                    <Overlay
                        onClick={onOverlayClick}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                    <BigMovie
                        layoutId={LayoutId}
                    >
                        {(modalData && dfModalData && creditData) && (
                            <>
                                <BigCover
                                    style={{
                                        backgroundImage: `linear-gradient(0deg, #181818, transparent 50%), url(${makeImagePath(
                                            modalData.backdrop_path,
                                            "w780"
                                        )})`,
                                    }}
                                />
                                <ModalCloseButton onClick={onOverlayClick}>
                                    <X />
                                </ModalCloseButton>
                                <BigTitle>{
                                    "title" in dfModalData
                                        ? dfModalData.title
                                        : dfModalData.name
                                }</BigTitle>
                                <ModalContentWrap>
                                    <MovieInfoWrap>
                                        <MovieYear>{
                                            "release_date" in dfModalData
                                                ? dfModalData.release_date.replace(/-/g, ".")
                                                : dfModalData.first_air_date.replace(/-/g, ".")
                                        }</MovieYear>
                                        <MovieRates><Star /> {dfModalData.vote_average}</MovieRates>
                                    </MovieInfoWrap>
                                    <ModalContentLine>
                                        <BigOverview>{dfModalData.overview}</BigOverview>
                                        <MovieAttendeesLine>
                                            {
                                                creditData.cast.length > 0 &&
                                                <MovieAttendees>
                                                    <MovieAttendeesTitle>Casting: </MovieAttendeesTitle>
                                                    <span>
                                                        {
                                                            creditData.cast.map((el, idx) => {

                                                                const comma = idx + 1 !== creditData.cast.length && ', ';

                                                                return (
                                                                    <span
                                                                        key={el.id}
                                                                    >{el.name}{comma}</span>
                                                                );
                                                            })
                                                        }
                                                    </span>
                                                </MovieAttendees>
                                            }
                                            {
                                                creditData.crew.length > 0 &&
                                                <MovieAttendees>
                                                    <MovieAttendeesTitle>Crews: </MovieAttendeesTitle>
                                                    <span>
                                                        {
                                                            creditData.crew.map((el, idx) => {

                                                                const comma = idx + 1 !== creditData.crew.length && ', ';

                                                                return (
                                                                    <span
                                                                        key={idx}
                                                                    >{el.name}{comma}</span>
                                                                );
                                                            })
                                                        }
                                                    </span>
                                                </MovieAttendees>
                                            }
                                            {
                                                modalData.genres.length > 0 &&
                                                <MovieAttendees>
                                                    <MovieAttendeesTitle>Genres: </MovieAttendeesTitle>
                                                    <span>
                                                        {
                                                            modalData.genres.map((el, idx) => {

                                                                const comma = idx + 1 !== modalData.genres.length && ', ';

                                                                return (
                                                                    <span
                                                                        key={el.id}
                                                                    >{el.name}{comma}</span>
                                                                );
                                                            })
                                                        }
                                                    </span>
                                                </MovieAttendees>
                                            }
                                        </MovieAttendeesLine>
                                    </ModalContentLine>
                                </ModalContentWrap>
                            </>
                        )}
                    </BigMovie>
                </>
            ) : null}
        </AnimatePresence>
    );
}

export default ContentModal;