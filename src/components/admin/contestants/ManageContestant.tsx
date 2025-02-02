"use client";
import React from "react";

import Sidebar from "../Sidebar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react"
import { ContestantsTable } from "./ContestantsTable";
import { AddContestant } from "./AddContestant";
import { DialogProvider, useDialog } from "@/lib/DialogContext";
import { Menu } from "lucide-react";
import axiosInstance from "@/utils/axiosInterceptor";

const ManageContestant = () => {
  const { openDialog } = useDialog();
  const [contestents, setContestents] = useState([])

  useEffect(()=>{
    (async ()=>{
      try{
        const { data } = await axiosInstance.get("/actress");
        setContestents(data.message)
      }catch(err){
        console.log(err)
      }
    })()
  },[])
  return (
    <div className="bg-[#1E1E1E] flex min-h-screen">
      <Sidebar />
      <div className="w-full px-[15px] py-[30px] md:p-[50px]">
        <div className="flex justify-between mb-[50px]">
          <div className="text-grad text-xl font-semibold flex items-center gap-2">
            <Menu className="lg:hidden" onClick={openDialog} size={25} />
            CONTESTANTS
          </div>
          <AddContestant  contestents={contestents} setContestents={setContestents}/>
        </div>

        <ContestantsTable contestents={contestents} setContestents={setContestents}/>
      </div>
    </div>
  );
};

export default ManageContestant;
