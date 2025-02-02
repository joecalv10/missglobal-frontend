"use client";
import React, { useEffect } from "react";
import Sidebar from "../Sidebar";
import { RoundsTable } from "./RoundsTable";
import { AddRounds } from "./AddRounds";
import { useDialog } from "@/lib/DialogContext";
import { Menu } from "lucide-react";
import { useState } from "react"
import axiosInstance from "@/utils/axiosInterceptor";

const ManageRounds = () => {
  const [rounds, setRounds] = useState([])
  const { openDialog } = useDialog();

  useEffect(()=>{
    (async ()=>{
      try{
        const { data } = await axiosInstance.get("/rounds");
        let isOngoingRoundAdded = false;
        let updatedRounds = data.message.map((model: any, index:any)=>{
          if(data.message[index]?.isStart === true && !isOngoingRoundAdded) {
            model.isOngoingRound = true;
            isOngoingRoundAdded = true;
          }else  model.isOngoingRound = false;
  
          return model;
        })
        setRounds(updatedRounds)
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
            ROUNDS
          </div>
          <AddRounds setRounds={setRounds} rounds={rounds}/>
        </div>

        <RoundsTable setRounds={setRounds} rounds={rounds} />
      </div>
    </div>
  );
};

export default ManageRounds;
