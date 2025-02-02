"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Loading from "./Loading";
import { setCookie } from "cookies-next";
import { login } from "@/store/slices/authSlice";

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  password: z.string(),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const { toast } = useToast();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/auth/login",
        {
          email: values.username,
          password: values.password,
        }
      );

      setCookie("accessToken", data.message.accesstoken, {
        expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        path: "/",
      });
      setCookie("refreshToken", data.message.refreshtoken, {
        expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        path: "/",
      });
      dispatch(login(true));

      toast({
        title: "Login Sucessfull",
      });
      
      console.log(data.message.role)

      data.message.role === "ADMIN" ? router.push("/admin/judges") : router.push("/");

    } catch (err:any) {
      console.log(err);
      setIsLoading(false);
      if (err.response) return  toast({
        title: err.response.data.message,
      });
      toast({
        title: err.message,
      });
    }
  }

  return (
    <>
      <Loading />

      <div className='px-[25px] pt-[30px] max-w-[450px] m-auto mt-3'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='user@missglobal.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant='grad' size={"full"} type='submit'>
             {isLoading? "Wait..": "Get In" }
            </Button>
          </form>
        </Form>

        {/* <p className="absolute w-full bottom-[50px] left-0 text-center px-[25px]">
          Are you an admin?{" "}
          <Link href="/login" className="text-grad">
            Login here
          </Link>
        </p> */}
      </div>
    </>
  );
}
