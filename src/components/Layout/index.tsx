"use client";

/* eslint-disable @next/next/no-sync-scripts */

import { useEffect } from "react";
import { fetchUser } from "../../store/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../PageHeader";
import { useRouter } from "next/navigation";
import { LoginForm } from "../LoginForm";
import { AppDispatch } from '@/store'; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useSelector((state:any) => state.auth);
  const router = useRouter();
  const dispatch:AppDispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && !user._id) dispatch(fetchUser());
    else router.push("/login")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAuthenticated]);

  return (
    <>
      {!user?._id? (
        <>
          <PageHeader />
          <LoginForm />
        </>
      ):children}
    </>
  );
};

export default Layout;
