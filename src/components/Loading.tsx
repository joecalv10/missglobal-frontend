"üse client";

import React, { useEffect, useState } from "react";
import loaderImage from "@public/loader.png";
import Image from "next/image";

const Loading = () => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {isVisible && (
        <div className="w-screen h-screen bg-black text-white flex justify-center items-center fixed top-0 left-0 z-50">
          <Image src={loaderImage} alt="loader" />
        </div>
      )}
    </>
  );
};

export default Loading;
