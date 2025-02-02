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
import { useState, useRef } from "react";

import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import axiosInstance from "@/utils/axiosInterceptor.js";
import { useDialog } from "@/lib/DialogContext";

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  password: z.string(),
});

interface AddJudgesProps {
  judges: any; // Replace SomeType with the actual type of contestents
  setjudges: React.Dispatch<React.SetStateAction<any>>; // Replace SomeType with the actual type of contestents
}

export function AddJudges({ setjudges, judges }: AddJudgesProps) {
  const { toast } = useToast();
  const { closeDialog } = useDialog();
  const [open, setOpen] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const plusButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post("/judge", {
        email: values.username,
        password: values.password,
      });
      setjudges([...judges, data.message]);
      toast({
        title: "Judge Added Successfully",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="grad" size={"w240"} type="button">
          <span className="hidden md:block">ADD NEW JUDGE</span>
          <Plus className="md:hidden" ref={plusButtonRef} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="text-grad text-xl font-semibold">ADD NEW JUDGE</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="judge1" {...field} />
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
      </DialogContent>
    </Dialog>
  );
}
