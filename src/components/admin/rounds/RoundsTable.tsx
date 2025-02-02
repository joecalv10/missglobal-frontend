"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/utils/axiosInterceptor";
import Image from "next/image";
import Link from "next/link";

interface AddRoundProps {
  rounds: any; // Replace SomeType with the actual type of contestents
  setRounds: React.Dispatch<React.SetStateAction<any>>; // Replace SomeType with the actual type of contestents
}

export function RoundsTable({ setRounds, rounds }: AddRoundProps) {
  const removeRoundHandler = async (id: any) => {
    try {
      await axiosInstance.delete("/rounds/" + id);
      setRounds(rounds.filter((model: any) => model._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const changeRoundButtonHandler = async (
    roundId: string,
    prevRoundId: string
  ) => {
    try {
      await axiosInstance.patch("/rounds/" + roundId, { isStart: true });
      setRounds(
        rounds.map((model: any) => {
          if (model._id === roundId) {
            model.isStart = true;
            model.isOngoingRound = true;
          }
          if (model._id === prevRoundId) {
            model.isStart = false;
            model.isOngoingRound = false;
            model.completed = true;
          }

          return model;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const endRoundButtonHandler = async (
    prevRoundId: string
  ) => {
    await axiosInstance.patch("/rounds/" + prevRoundId + "/end", { isStart: true });
      setRounds(
        rounds.map((model: any) => {
          if (model._id === prevRoundId) {
            model.isStart = false;
            model.isOngoingRound = false;
            model.completed = true;
          }

          return model;
        })
      );
  }

  return (
    <div className="bg-black border-white border rounded-[10px]">
      <Table className="  ">
        <TableHeader>
          <TableRow className="hover:bg-[#22222274] !border-b-0 text-[#222222] ">
            <TableHead className="w-[100px] ">S.No</TableHead>
            <TableHead>Round Name</TableHead>
            <TableHead>Contestants to Qualify</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rounds.map(
            (
              round: {
                name: string;
                qualifyContestants: number;
                _id: string;
                isStart: boolean;
                completed:boolean;
                isOngoingRound: boolean;
              },
              index: number
            ) => {
              return (
                <TableRow key={index} className="hover:bg-[#22222274]">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{round.name}</TableCell>
                  <TableCell>{round.qualifyContestants}</TableCell>
                  <TableCell>
                    {round.completed && (
                      <Link
                        className="h-auto py-[5px] px-[8px]  text-grad text-base"
                        href={"/admin/rounds/" + round._id}
                      >
                        VIEW RESULTS
                      </Link>
                    )}

                    {round.isOngoingRound && (
                      <Link
                        className="h-auto py-[5px] px-[8px]  text-grad text-base"
                        href=""
                      >
                        STARTED ROUND
                      </Link>
                    )}

                    {!round.completed && (
                      <Link
                        className="h-auto py-[5px] px-[8px]  text-grad text-base"
                        href=""
                      ></Link>
                    )}
                  </TableCell>

                  <TableCell>
                    {((!round.completed && !round.isStart) || !rounds.find((round:any)=>round.isOngoingRound == true)) && <Button
                      variant={"destructive"}
                      size={"sm"}
                      onClick={() => removeRoundHandler(round._id)}
                      className="h-auto py-[5px] mx-[8px] px-[8px] text-[11px]"
                    >
                      Remove
                    </Button>}

                    {rounds[index - 1]?.isStart && (
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        onClick={() =>
                          changeRoundButtonHandler(
                            round._id,
                            rounds[index - 1]._id
                          )
                        }
                        className="h-auto py-[5px] px-[8px] text-[11px]"
                      >
                        Start
                      </Button>
                    )}

                     {round.isOngoingRound && index === rounds.length - 1 && (
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        onClick={() =>
                          endRoundButtonHandler(
                            round._id,
                          )
                        }
                        className="h-auto py-[5px] px-[8px] text-[11px]"
                      >
                        End
                      </Button>
                    )} 

                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </div>
  );
}
