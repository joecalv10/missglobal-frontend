"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import axiosInstance from "@/utils/axiosInterceptor";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).optional(),
  password: z.string().optional(),
});
interface modalProps {
  setOpen: any;
  judge: any;
  setjudges: any;
  judges:any
}

const EditContestant = ({ setOpen, judge, setjudges, judges }: modalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: judge?.email || "", // use the judge's email or an empty string as a default value
      password: "" // set an empty string as a default value for password
  }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();
    setIsLoading(true);
    try {

      const {data}= await axiosInstance.patch("/judge/" + judge._id, {
        email:values.username,
        password:values.password
      });
 
      setjudges(judges.map((judge:any)=>{
        if(judge._id == data.message._id) judge.email = data.message.email;

        return judge;
      }))
      toast({
        title: "Judge Update Successfully",
      });
      setIsLoading(false);
      setOpen(false);
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      if (err.response)
        return toast({
          title: err.response.data.message,
        });
      toast({
        title: err.message,
      });
    }
  }
  return (
    <div>
      <div className="text-grad text-xl font-semibold">EDIT JUDGE</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Name</FormLabel>
                <FormControl>
                  <Input placeholder="judge1" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="grad" size={"full"} type="submit">
            {isLoading ? "Wait..." : "Get In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditContestant;
