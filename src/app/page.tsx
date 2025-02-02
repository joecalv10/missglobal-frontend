"use client";
import Contestants from "@/components/Contestants";
import PageHeader from "@/components/PageHeader";
import axiosInstance from "@/utils/axiosInterceptor";
import { useState, useEffect } from "react";

interface Round {
  _id: string;
  qualifyContestants: number;
  scores: any;
  wildCards: any;
  isFirstRound: boolean;
  endDate: number;
  startDate: number;
  name: string;
}

export default function Home() {
  const [currentRound, setCurrentRound] = useState<Round | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/rounds/current");
        setCurrentRound(data.message);
      } catch (err) {}
    })();
  }, []);

  return currentRound ? (
    <>
      <PageHeader
        type="round"
        title={currentRound.name}
      />
      <Contestants currentRound={currentRound} />
    </>
  ) : (
    <div className="px-4 flex flex-col justify-center max-w-[450px] m-auto mt-[30px] mb-10 text-center">
      <div className="text-mid capitalize mt-[6px] mb-[50px]">
        No Round Started Till Now !
      </div>
    </div>
  );
}
