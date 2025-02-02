"use client";
import React from "react";
import Sidebar from "../Sidebar";
import { Button } from "@/components/ui/button";
import { ContestantsTable } from "./JudgesTable";
import { AddJudges } from "./AddJudges";
import { DialogProvider, useDialog } from "@/lib/DialogContext";
import { useState, useEffect } from "react"
import { Menu } from "lucide-react";
import axiosInstance from "@/utils/axiosInterceptor";

const ManageJudges = () => {
  const { openDialog } = useDialog();
  const [judges, setjudges] = useState([])

  useEffect(()=>{
    (async ()=>{
      try{
        const { data } = await axiosInstance.get("/judge");
        setjudges(data.message)
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
            JUDGES
          </div>
          <AddJudges setjudges={setjudges} judges={judges}/>
        </div>

        <ContestantsTable models={judges} setjudges={setjudges}/>
      </div>
    </div>
  );
};

export default ManageJudges;
