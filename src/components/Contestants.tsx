"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import ArrowLeft from "@public/icons/ArrowFatLinesleft.svg";
import ArrowRight from "@public/icons/ArrowFatLinesRight.svg";
import { Slider } from "@/components/ui/slider";
import ReactCountryFlag from "react-country-flag";
import { Button } from "./ui/button";
import Flag from "react-world-flags";
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInterceptor";

interface CurrentRoundProps {
  currentRound: any;
}

const Contestants = ({ currentRound }: CurrentRoundProps) => {
  const { user } = useSelector((state: any) => state.auth);
  const [contestants, setcontestants] = useState<any[]>([]);
  const [contestantCount, setcontestantCount] = useState(0);
  const [score, setScore] = useState<any>({});
  const [submitScreen, setsubmitScreen] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const setScores = (id: any, value: any, key: any) => {
    if (!score[id]) score[id] = {};
    score[id][key] = value;

    setScore({ ...score });
  };

  useEffect(() => {
    (async () => {
      try {
        if (currentRound.isFirstRound) {
          const { data } = await axiosInstance.get("/actress");
          let updatedData = data.message.filter((actress: any) => {
            if (
              !currentRound.scores.find(
                (scr: any) =>
                  scr.ratedTo == actress._id && scr.ratedBy == user._id
              )
            )
              return actress;
          });
          updatedData.sort((a:any, b:any) => a.country.localeCompare(b.country));
          setcontestants(updatedData);
          let score: any = {};
          updatedData.forEach((cont: any) => {
            if (!score[cont._id]) score[cont._id] = {};
            score[cont._id]["personality"] = [0];
            score[cont._id]["attitude"] =[0];
            score[cont._id]["pose"] =[0]
          });

          setScore({ ...score });
        } else {
          const { data } = await axiosInstance.get("/rounds/winner/prevRound");

          let filteredRatedTo =
            data?.message?.ratedTo.filter(
              (actress: any) =>
                !currentRound.scores.find(
                  (scr: any) =>
                    scr.ratedTo == actress._id && scr.ratedBy == user._id
                )
            ) || [];

          let filteredWildcardsTo =
            data?.wildcards.filter(
              (actress: any) =>
                !currentRound.scores.find(
                  (scr: any) =>
                    scr.ratedTo == actress._id && scr.ratedBy == user._id
                )
            ) || [];

          let allContestants = [...filteredRatedTo, ...filteredWildcardsTo];
          allContestants.sort((a:any, b:any) => a.country.localeCompare(b.country));
          setcontestants(allContestants);
          let score: any = {};
          allContestants.forEach((cont:any) => {
            if (!score[cont._id]) score[cont._id] = {};
            score[cont._id]["personality"] = [0];
            score[cont._id]["attitude"] =[0];
            score[cont._id]["pose"] =[0]
          });

          setScore({ ...score });
        }
      } catch (err) {
        setcontestants([]);
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
    if (seconds === 0) {
      // if (contestantCount < contestants.length - 1) {
      //   setcontestantCount(contestantCount + 1);
      //   setSeconds(30);
      // }
    }
  }, [seconds]);

  const handleNext = () => {
    if (contestantCount < contestants.length - 1) {
      setcontestantCount(contestantCount + 1);
      setSeconds(30);
    } else {
      console.log("limit reached", contestantCount);
      setsubmitScreen(true);
    }
  };

  const handlePrev = () => {
    if (contestantCount > 0) {
      setcontestantCount(contestantCount - 1);
      setSeconds(30);
    } else {
      console.log("limit reached", contestantCount);
    }
  };

  const submitScoreHandler = async () => {
    let updatedScores = Object.keys(score).map((scr) => {
      return {
        personality: score[scr].personality[0],
        pose: score[scr].pose[0],
        attitude: score[scr].attitude[0],
        ratedBy: user._id,
        ratedTo: scr,
      };
    });

    try {
      await axiosInstance.post("/judge/score", {
        roundId: currentRound?._id,
        score: updatedScores,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    contestants && (
      <>
        {!submitScreen && contestants.length !== 0 ? (
          <div className='px-4 flex flex-col justify-center max-w-[450px] m-auto mt-[20px] mb-10'>
            <div className='text-grad text-3xl font-semibold text-center'>
              {seconds}
            </div>
            <div className='cSingle text-center'>
              <div className='text-grad text-xl font-semibold flex items-center gap-2 justify-center'>
                {contestants[contestantCount].country}
                <span className='w-[30px]'>
                  <Flag
                    code={contestants[contestantCount].countryCode}
                    height='16'
                  />
                </span>
              </div>
              <div className='text-mid capitalize mt-[6px]'>
                {contestants[contestantCount].name}

                <ReactCountryFlag countryCode='US' />
                <span className='flag-icon flag-icon-gr'></span>
              </div>
              <div className='text-mid mb-[10px]'>
                Age {contestants[contestantCount].age} • Height{" "}
                {contestants[contestantCount].height}
              </div>
              <div className=' relative rounded-[10px] overflow-hidden bg-grad p-[5px]'>
                <AspectRatio ratio={1} className='bg-muted rounded-[10px]'>
                  <img
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_URL +
                      contestants[contestantCount].pic
                    }
                    alt={contestants[contestantCount].name}
                    // objectFit='cover'
                    className='rounded-[10px]'
                  />
                </AspectRatio>
              </div>

              {/* PERSONALITY SCORE SLIDER */}
              <div className='slider mt-[25px]'>
                <div className='text-left leading-none tracking-widest font-semibold'>
                {currentRound.CriteriaPerRound}
                </div>
                <div className='flex gap-[20px] items-center '>
                  <Slider
                    defaultValue={
                      score[contestants[contestantCount]._id]?.personality || 0
                    }
                    onValueChange={(value) =>
                      setScores(
                        contestants[contestantCount]._id,
                        value,
                        "personality"
                      )
                    }
                    value={[
                      score[contestants[contestantCount]._id]?.personality || 0,
                    ]}
                    step={1}
                    min={0}
                    max={5}
                  />

                  <div className='!w-[60px] h-[50px] bg-grad flex justify-center items-center text-xl font-semibold rounded-[5px]'>
                    {score[contestants[contestantCount]._id]?.personality || 0}
                  </div>
                </div>
              </div>

              {/* POISE SCORE SLIDER */}
              {/* <div className='slider mt-[5px]'>
                <div className='text-left leading-none tracking-widest font-semibold'>
                  POISE
                </div>
                <div className='flex gap-[20px] items-center '>
                  <Slider
                    defaultValue={
                      score[contestants[contestantCount]._id]?.pose || 0
                    }
                    onValueChange={(value) =>
                      setScores(contestants[contestantCount]._id, value, "pose")
                    }
                    value={[score[contestants[contestantCount]._id]?.pose || 0]}
                    step={1}
                    min={0}
                    max={10}
                  />

                  <div className='!w-[60px] h-[50px] bg-grad flex justify-center items-center text-xl font-semibold rounded-[5px]'>
                    {score[contestants[contestantCount]._id]?.pose || 0}
                  </div>
                </div>
              </div> */}

              {/* ATTITUDE SCORE SLIDER */}
              {/* <div className='slider mt-[5px]'>
                <div className='text-left leading-none tracking-widest font-semibold'>
                  ATTITUDE
                </div>
                <div className='flex gap-[20px] items-center '>
                  <Slider
                    defaultValue={
                      score[contestants[contestantCount]._id]?.attitude || 0
                    }
                    onValueChange={(value) =>
                      setScores(
                        contestants[contestantCount]._id,
                        value,
                        "attitude"
                      )
                    }
                    value={[
                      score[contestants[contestantCount]._id]?.attitude || 0,
                    ]}
                    step={1}
                    min={0}
                    max={5}
                  />

                  <div className='!w-[60px] h-[50px] bg-grad flex justify-center items-center text-xl font-semibold rounded-[5px]'>
                    {score[contestants[contestantCount]._id]?.attitude || 0}
                  </div>
                </div>
              </div> */}
            </div>
            <div className='controls flex justify-between items-center mt-8'>
              <button
                className='prev flex gap-[8px] items-center font-semibold'
                onClick={() => handlePrev()}>
                <Image src={ArrowRight} alt='arrow left' />
                PREV
              </button>

              <button
                className='prev flex gap-[8px] items-center font-semibold'
                onClick={() => handleNext()}>
                NEXT
                <Image src={ArrowLeft} alt='arrow left' />
              </button>
            </div>
          </div>
        ) : !isSubmitted && contestants.length !== 0 ? (
          <div className='px-4 flex flex-col justify-center max-w-[450px] m-auto mt-[30px] mb-10 text-center'>
            <div className='text-grad text-xl font-semibold'>
              FINAL SUBMISSION <br />
            </div>
            <div className='text-mid capitalize mt-[6px] mb-[50px]'>
              Once you submit, you can not change scores later.
            </div>
            <Button
              variant='grad'
              onClick={submitScoreHandler}
              size={"full"}
              type='submit'>
              SUBMIT
            </Button>

            <Button
              variant='secondary'
              size={"full"}
              type='submit'
              className='mt-[20px]'
              onClick={() => setsubmitScreen(false)}>
              GO BACK
            </Button>
          </div>
        ) : (
          <div className='px-4 flex flex-col justify-center max-w-[450px] m-auto mt-[30px] mb-10 text-center'>
            <div className='text-mid capitalize mt-[6px] mb-[50px]'>
              You have successfully submitted your score !
            </div>
          </div>
        )}
      </>
    )
  );
};

export default Contestants;
