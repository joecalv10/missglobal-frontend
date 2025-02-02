import React, { FC } from "react";
import Logo from "@public/mg-logo.png";
import Image from "next/image";
import Link from "next/link";

interface Props {
  type?: "login" | "round";
  title?: string;
  subtitle?: string;
}

const PageHeader: FC<Props> = ({
  type = "login",
  title = "LOGIN",
  subtitle = "",
}) => {
  return (
    <div className="pageHeader">
      <div className="flex justify-center pt-[35px] ">
        <Link href={"/"}>
          <Image src={Logo} alt="loader" />
        </Link>
      </div>

      <div className={`${type === "login" ? "bg-grad" : "bg-[#222]"}  `}>
        <div
          className={`max-w-[850px] m-auto flex items-center justify-center px-[25px]  mt-[30px]
        ${type === "login" ? "py-[28px]" : "py-[20px]"}`}
        >
          <div
            className={`text-xl font-semibold ${
              type === "login" ? "aa" : "text-grad"
            }`}
          >
            {title}
          </div>

          {/* <div className={` ${type === "login" ? "aa" : "text-grad"}`}>
            {subtitle}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
