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
import EditJudgeForm from "./EditJudgeForm";
import axiosInstance from "@/utils/axiosInterceptor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { FileEdit, Trash2 } from "lucide-react";

interface AddJudgesProps {
  models: any; // Replace SomeType with the actual type of contestents
  setjudges: React.Dispatch<React.SetStateAction<any>>; // Replace SomeType with the actual type of contestents
}

export function ContestantsTable({ models, setjudges }: AddJudgesProps) {
  const [open, setOpen] = useState(false);
  const [judge, setjudge] = useState(null)

  const handleEditModal = (judge:any) => {
    setjudge(judge);
    setOpen(true);
  };
  const removeJudgeHandler = async (id: any) => {
    try {
      await axiosInstance.delete("/judge/" + id);
      setjudges(models.filter((model: any) => model._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-black border-white border rounded-[10px]">
        <Table className="  ">
          <TableHeader>
            <TableRow className="hover:bg-[#22222274] !border-b-0 text-[#222222] ">
              <TableHead className="w-[100px] ">S.No</TableHead>
              <TableHead className="min-w-[175px] md:min-w-auto">
                Email
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map(
              (
                model: {
                  email: string;
                  _id: string;
                },
                index: number
              ) => (
                <TableRow key={index} className="hover:bg-[#22222274]">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{model.email}</TableCell>
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
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <EditJudgeForm setOpen={setOpen} judge={judge} setjudges={setjudges} judges={models}/>
        </DialogContent>
      </Dialog>
    </>
  );
}
