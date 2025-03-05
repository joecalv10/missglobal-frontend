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

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import axiosInstance from "@/utils/axiosInterceptor";

const formSchema = z.object({
  roundName: z.string(),
  contestantsToQualify: z.string(),
  CriteriaPerRound: z.string(),
});

interface AddRoundProps {
  rounds: any; // Replace SomeType with the actual type of contestents
  setRounds: React.Dispatch<React.SetStateAction<any>>; // Replace SomeType with the actual type of contestents
}

export function AddRounds({ setRounds, rounds }: AddRoundProps) {
  const [isFirstRound, setIsFirstRound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post("/rounds", {
        name: values.roundName,
        qualifyContestants: values.contestantsToQualify,
        CriteriaPerRound: values.CriteriaPerRound,
        isFirstRound,
      });
       data.message.isOngoingRound = isFirstRound;
      setRounds([...rounds, data.message]);
      toast({
        title: "Rounds Added Successfully",
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
          <span className="hidden md:block">ADD NEW ROUND</span>
          <Plus className="md:hidden" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="text-grad text-xl font-semibold">ADD NEW ROUND</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roundName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Round Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contestantsToQualify"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Contestants to Qualify
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="CriteriaPerRound"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Criteria Per Round
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel className="text-base">IsFirstRound</FormLabel>
            <input
              checked={isFirstRound}
              onChange={(e) => setIsFirstRound(e.target.checked)}
              style={{
                marginLeft: "5px",
                fontSize: "10px",
                position: "relative",
                top: "3px",
              }}
              type="checkbox"
              name=""
              id=""
            />

            <Button variant="grad" size={"full"} type="submit">
              {isLoading ? "wait.." : "Add Round"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
