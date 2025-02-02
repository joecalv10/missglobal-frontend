"use client";
import React from "react";
import Sidebar from "../Sidebar";
import { Button } from "@/components/ui/button";
import { ContestantsTable } from "./ContestantsTable";
import { AddWildcard } from "./AddWildcard";
import { Menu, Shuffle } from "lucide-react";
import { useDialog } from "@/lib/DialogContext";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInterceptor";
import * as XLSX from "xlsx";
const fileExtension = ".xlsx";

interface ManageWinnersProps {
  roundId: any;
}

interface Winner {
  name: string;
  country: string;
  age: number;
  height: number;
  pic: string;
  score: number;
}

const ManageWinners = ({ roundId }: ManageWinnersProps) => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isResuffle, setIsResuffle] = useState<boolean>(false);
  const [prevState, setPrevState] = useState<Winner[]>([]);
  const { openDialog } = useDialog();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/rounds/winners/" + roundId);
        let updatedData;
        if (data?.message?.ratedTo)
          updatedData = [...data.message.ratedTo, ...data.wildcards];
        else updatedData = data.wildcards;

        setWinners(updatedData);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const exportButtonHandler = () => {
    let exportedData = [...winners];

    const exportedArray: any = [];

    exportedData.map((winner: Winner) => {
      exportedArray.push({
        name: winner.name,
        country: winner.country,
        age: winner.age,
        height: winner.height,
        score: winner.score,
      });
    });

    const ws = XLSX.utils.json_to_sheet(exportedArray);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    XLSX.writeFile(wb, "Miss Global - Winners" + fileExtension);
  };

  function shuffle(originalArray: Winner[]): Winner[] {
    let array = [...originalArray]; // Create a copy of the original array
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  return (
    <div className='bg-[#1E1E1E] flex min-h-screen'>
      <Sidebar />
      <div className='w-full px-[15px] py-[30px] md:p-[50px]'>
        <div className='flex justify-between mb-[50px]'>
          <div className='text-grad text-xl font-semibold flex items-center gap-2'>
            <Menu className='lg:hidden' onClick={openDialog} size={25} />
            WINNERS
          </div>

          <div className='flex gap-3'>
            <Button
              variant='grad'
              size={"w240"}
              type='button'
              onClick={exportButtonHandler}>
              <span className='md:block'>EXPORT</span>
            </Button>
            <Button
              onClick={() => {
                if (!isResuffle) {
                  setPrevState([...winners]);
                  const shuffledArr = shuffle(winners);
                  setWinners([...shuffledArr]);
                  setIsResuffle(true);
                } else {
                  setWinners([...prevState]);
                  setIsResuffle(false);
                }
              }}
              variant='grad'
              size={"w240"}
              type='button'>
              <span className='hidden md:block'>
                {isResuffle ? "RESET" : "SHUFFLE"}
              </span>
              <Shuffle className='md:hidden' />
            </Button>
            <AddWildcard
              setWinners={setWinners}
              winners={winners}
              isWildcard={roundId}
            />
          </div>
        </div>

        <ContestantsTable winners={winners} />
      </div>
    </div>
  );
};

export default ManageWinners;
