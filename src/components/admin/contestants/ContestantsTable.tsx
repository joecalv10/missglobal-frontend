"use client";
import React from "react";
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
import { FileEdit, Trash2 } from "lucide-react";
import Image from "next/image";
import EditContestant from "./EditContestant";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AddContestantProps {
  contestents: any; // Replace SomeType with the actual type of contestents
  setContestents: React.Dispatch<React.SetStateAction<any>>; // Replace SomeType with the actual type of contestents
}

export function ContestantsTable({
  contestents,
  setContestents,
}: AddContestantProps) {
  const removeJudgeHandler = async (id: any) => {
    try {
      await axiosInstance.delete("/actress/" + id);
      setContestents(contestents.filter((model: any) => model._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const [open, setOpen] = useState(false);
  const [actress, setActress] = useState(null)

  const handleEditModal = (actress:any) => {
    setActress(actress);
    setOpen(true);
  };

  return (
    <>
      <div className="bg-black border-white border rounded-[10px]">
        <Table className="  ">
          <TableHeader>
            <TableRow className="hover:bg-[#22222274] !border-b-0 text-[#222222] ">
              <TableHead className="w-[100px]">S.No</TableHead>
              <TableHead className="min-w-[170px]">Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Height</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contestents.map(
              (
                model: {
                  name: string;
                  country: string;
                  age: number;
                  height: string;
                  _id: string;
                  pic: string;
                },
                index: number
              ) => (
                <TableRow key={index} className="hover:bg-[#22222274]">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="flex gap-1 md:gap-2 items-center">
                    <div className="modelImg relative !w-[24px] h-[24px] rounded-[50%] overflow-hidden inline-block align-middle">
                      <img
                        src={process.env.NEXT_PUBLIC_IMAGE_URL + model.pic}
                        className="modelImg relative !w-[24px] h-[24px] rounded-[50%] overflow-hidden inline-block align-middle"
                        alt={model.name}
                      />
                    </div>
                    {model.name}
                  </TableCell>
                  <TableCell>{model.country}</TableCell>
                  <TableCell>{model.age}</TableCell>
                  <TableCell>{model.height}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant={"secondary"}
                      size={"sm"}
                      onClick={() => handleEditModal(model)}
                      className="h-auto py-[5px] px-[8px] text-[11px]"
                    >
                      <FileEdit />
                    </Button>

                    <Button
                      variant={"destructive"}
                      size={"sm"}
                      onClick={() => removeJudgeHandler(model._id)}
                      className="h-auto py-[5px] px-[8px] text-[11px]"
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>

        {/* <EditContestant openModal={editModal} /> */}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <EditContestant setOpen={setOpen} actress={actress} contestents={contestents} setContestents={setContestents}/>
        </DialogContent>
      </Dialog>
    </>
  );
}
