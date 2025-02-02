"use client";

import React from "react";
import Logo from "@public/mg-logo.png";
import contestantIcon from "@public/icons/contestants.svg";
import judgesIcon from "@public/icons/judges.svg";
import roundsIcon from "@public/icons/rounds.svg";
import logoutIcon from "@public/icons/logout.svg";
import contestantAIcon from "@public/icons/contestantsA.svg";
import { useState } from "react"
import Image from "next/image";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDialog } from "@/lib/DialogContext";
import { X } from "lucide-react";
import axios from "axios"
import { deleteCookie, getCookie } from "cookies-next";

const Sidebar = () => {
  const [isLoading, setIsLoading] = useState(false)
  const currentRoute = usePathname();
  const links = {
    contestant: "/admin/contestants",
    judges: "/admin/judges",
    rounds: "/admin/rounds",
    logout: "/admin/logout",
  };
  const router = useRouter();

  const { isDialogOpen, closeDialog } = useDialog();

  // if (!isDialogOpen) {
  //   return null;
  // }

  const nav = [
    {
      name: "CONTESTANTS",
      link: "/admin/contestants",
      icon: contestantIcon,
      activeIcon: contestantAIcon,
    },
    {
      name: "JUDGES",
      link: "/admin/judges",
      icon: judgesIcon,
      activeIcon: judgesIcon,
    },
    {
      name: "ROUNDS",
      link: "/admin/rounds",
      icon: roundsIcon,
      activeIcon: roundsIcon,
    },
  ];

  const handleLogout = async () => {
    closeDialog();
  setIsLoading(true)
    try{
      await axios.get(process.env.NEXT_PUBLIC_API_URL + "/auth/logout", {
        headers: { Authorization: `JWT ${getCookie("refreshToken")}` },
      });
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      router.push("/login")
       setIsLoading(false)
   }catch(err){
    setIsLoading(false)
     console.log(err)
   }
  };

  const iscontestantsActive = currentRoute === links.contestant;
  const isAboutActive = currentRoute === "/about";

  return (
    <div
      className={`w-[100vw] md:min-w-[300px] md:max-w-[300px] px-[15px] md:px-[25px] py-[50px] bg-black min-h-[100vh] fixed left-0 top-0 z-20 lg:static transition-all ease-in-out ${
        isDialogOpen ? "left-0" : "left-[-100%]"
      } `}
    >
      <Image src={Logo} alt="logo" className="m-auto mb-[85px]" quality={100} />

      <X
        className="lg:hidden block absolute top-[15px] right-[20px]"
        onClick={closeDialog}
      />

      <div className="buttons flex flex-col space-y-1">
        {nav.map((item, i) => (
          <Link key={i} href={item.link} onClick={closeDialog}>
            <div
              className={`flex gap-2 items-center px-[30px] py-[18px] rounded-[10px] hover:bg-[#222] ${
                currentRoute == item.link ? "bg-[#222] " : null
              } `}
            >
              {iscontestantsActive ? (
                <Image src={item.activeIcon} alt="icon" />
              ) : (
                <Image src={item.icon} alt="icon" />
              )}

              <span
                className={` ${
                  currentRoute == item.link ? " text-grad" : null
                } `}
              >
                {item.name}
              </span>
            </div>
          </Link>
        ))}
        {/* <Link key={i} href={item.link}> */}
        <div
          onClick={handleLogout}
          className={`flex gap-2 items-center px-[30px] py-[18px] rounded-[10px] hover:bg-[#222] cursor-pointer`}
        >
          {iscontestantsActive ? (
            <Image src={logoutIcon} alt="icon" />
          ) : (
            <Image src={logoutIcon} alt="icon" />
          )}

          <span>{isLoading?"Wait..":"LOGOUT"}</span>
        </div>
        {/* </Link> */}
      </div>
    </div>
  );
};

export default Sidebar;
