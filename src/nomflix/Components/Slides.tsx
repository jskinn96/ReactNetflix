import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { IGetMovies, TGetMoviesResults } from "../Api/MovieApi";
import { useNavigate } from "react-router-dom";
import { makeImagePath } from "../Utils/Utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IGetTv, TGetTvResults } from "../Api/TvApi";

const Slider = styled.div`
    position: relative;
    width: 100%;
    padding-bottom: 8.335%;
    pointer-events: none;
    &:hover .slideArrowStyle {
        opacity: 1;
    }
`;

const Row = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 60px;
    white-space: nowrap;
    left: calc(-16.66666667% + 20px);
    pointer-events: all; 
`;

const Box = styled(motion.div)`
    display: inline-block;
    width: 16.66666667%;
    height: 100%;
    padding: 0 .2vw;
    &:nth-of-type(2) .SlideCont {transform-origin: center left !important;}
    &:nth-of-type(7) .SlideCont {transform-origin: center right !important;}
`;

const BoxCont = styled(motion.div) <{ $bgPhoto: string }>`
    border-radius: 4px;
    font-size: 66px;
    height: 100%;
    background-image: url(${(props) => props.$bgPhoto});
    background-size: cover;
    background-position: center center;
    cursor: pointer;
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

const ArrowWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
`;

const ArrowLine = styled.div`
    width: 60px;
    height: 100%;
`;

const PrevArrow = styled.div`
    opacity: 0;
    background: hsla(0, 0%, 8%, .5);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    pointer-events: all;
`;

const NextArrow = styled(PrevArrow)`
    border-radius: 4px 0 0 4px;
`;

const rowVariants = {
    hidden: (custom: number) => ({ x: custom }),
    visible: { x: 0 },
    exit: (custom: number) => ({ x: -custom }),
};

const BoxContVariants = {
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

interface ISlides {
    data: IGetMovies | IGetTv;
    airType: string;
}

export interface SlidesHandle {
    onMovieInfoModal: (movieId: number, type: string) => void;
}

const Slides = forwardRef<SlidesHandle, ISlides>(({ data, airType }, ref) => {

    const offset = 6;
    const tmpData = useMemo(() => data ? data.results.slice(1) : [], [data]);
    const totalMovies = tmpData.length;
    const maxMIdx = useMemo(() => Math.floor(totalMovies / offset), [totalMovies, offset]);

    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const movieNavi = useNavigate();
    const [isFirst, setIsFirst] = useState(true);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [slideDistance, setSlideDistance] = useState(0);
    const [movieArr, setMovieArr] = useState<(TGetMoviesResults | TGetTvResults)[]>([]);

    const onMovieInfoModal = (movieId: number, type: string) => {

        movieNavi(`?movieId=${movieId}&type=${type}`);
    };

    //g ref를 통해 함수에 접근 가능하게 변경
    useImperativeHandle(ref, () => ({
        onMovieInfoModal,
    }));

    const normalDistance = (dir: 1 | 2 = 2, moveBox: number = 0) => {

        if (!sliderRef.current?.clientWidth) return;

        const rowWidth = sliderRef.current?.clientWidth;
        const boxWidth = (rowWidth - 120) * 16.66666667 / 100;

        let distance;
        if (moveBox === 0) distance = boxWidth * offset;
        else {

            const moveBoxCount = moveBox - 1;
            distance = 60 + (boxWidth * moveBoxCount);
        }

        setSlideDistance(dir === 2 ? distance : -distance);
    }

    useEffect(() => {

        if (tmpData.length > 0 && movieArr.length === 0) {

            const slidesData = tmpData.slice(0, 7);
            setMovieArr([tmpData[tmpData.length - 1], ...slidesData]);

            normalDistance();
        }

    }, []);

    const nextSlide = (dir: 1 | 2 = 2) => {

        if (!data || !data.results || leaving) return;

        let moveFuncCheck = false;

        //g 오른쪽
        let nextSlideData;
        if (dir === 2) {

            const currentIdx = index === maxMIdx ? 0 : index + 1;
            setIndex(currentIdx);

            const startData = movieArr[offset];
            const startId = startData.id;
            const startIdx = tmpData.findIndex(el => el.id === startId);
            const endIdx = startIdx + offset + 2;

            nextSlideData = tmpData.slice(startIdx, endIdx);
            if (startIdx === totalMovies - 1) {

                const targetData = tmpData.slice(0, offset);
                nextSlideData = [tmpData[totalMovies - 1], ...targetData, tmpData[offset]];

            } else if (endIdx > totalMovies - 1) {

                const remain = offset - nextSlideData.length;
                if (remain > -2) {

                    const fallback = tmpData.slice(totalMovies - 1 - offset);
                    nextSlideData = [...fallback, tmpData[0]];

                    normalDistance(dir, totalMovies - startIdx);
                    moveFuncCheck = true;
                }
            }

        } else { //g 왼쪽

            const currentIdx = index === 0 ? maxMIdx : index - 1;
            setIndex(currentIdx);

            const endData = movieArr[1];
            const endId = endData.id;
            const endIdx = tmpData.findIndex(el => el.id === endId) + 1;
            const startIdx = endIdx - offset - 2;

            nextSlideData = tmpData.slice(startIdx, endIdx);
            if (endIdx === 1) {

                const targetData = tmpData.slice(totalMovies - 1 - offset);
                nextSlideData = [...targetData, tmpData[0]];

            } else if (0 > startIdx) {

                const startData = tmpData.slice(0, offset);
                nextSlideData = [tmpData[totalMovies - 1], ...startData, tmpData[offset]];

                normalDistance(dir, endIdx);
                moveFuncCheck = true;
            }
        }

        if (!moveFuncCheck) normalDistance(dir);

        setMovieArr(nextSlideData);

        setLeaving(true);

        if (isFirst === true) setIsFirst(false);
    }

    return (
        <Slider
            ref={sliderRef}
        >
            <AnimatePresence
                initial={false}
                onExitComplete={() => setLeaving(false)}
            >
                <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: .8, ease: "easeInOut" }}
                    custom={slideDistance}
                    key={index}
                >
                    {
                        movieArr.map((movie, idx) => {

                            const bg = movie.backdrop_path
                                ? makeImagePath(movie.backdrop_path, "w500")
                                : "https://placehold.co/500x500/2F2F2F/ffffff?text=No+Image";

                            return (
                                <Box
                                    key={movie.id}
                                >
                                    {
                                        isFirst && idx === 0
                                            ? ""
                                            : <BoxCont
                                                layoutId={`${movie.id}_${airType}`}
                                                $bgPhoto={bg}
                                                whileHover="hover"
                                                initial="normal"
                                                transition={{ type: "tween" }}
                                                variants={BoxContVariants}
                                                className="SlideCont"
                                                onClick={() => onMovieInfoModal(movie.id, airType)}
                                            >
                                                <Info variants={infoVariants}>
                                                    <h4>{
                                                        "title" in movie
                                                            ? movie.title
                                                            : movie.name
                                                    }</h4>
                                                </Info>
                                            </BoxCont>
                                    }
                                </Box>
                            );
                        })
                    }
                </Row>
                <ArrowWrap>
                    <ArrowLine>
                        {
                            !isFirst &&
                            <PrevArrow
                                className="slideArrowStyle"
                                onClick={() => nextSlide(1)}
                            >
                                <ArrowLeft />
                            </PrevArrow>
                        }
                    </ArrowLine>
                    <ArrowLine>
                        <NextArrow
                            className="slideArrowStyle"
                            onClick={() => nextSlide()}
                        >
                            <ArrowRight />
                        </NextArrow>
                    </ArrowLine>
                </ArrowWrap>
            </AnimatePresence>
        </Slider>
    );
});

export default Slides;