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
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import axiosInstance from "@/utils/axiosInterceptor";

const formSchema = z.object({
  name: z.string(),
  country: z.string(),
  age: z.string(),
  height: z.string(),
});

interface AddWildcardProps {
  winners: any; // Replace SomeType with the actual type of contestents
  setWinners: React.Dispatch<React.SetStateAction<any>>; // Replace SomeType with the actual type of contestents
  isWildcard: any;
}

export function AddWildcard({
  winners,
  setWinners,
  isWildcard,
}: AddWildcardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();
    if (!file) throw new Error("Upload Image before Submitting !");
    setIsLoading(true);
    try {
      const form_data = new FormData();
      form_data.append("file", file);
      form_data.append("name", values.name);
      form_data.append("country", values.country);
      form_data.append("age", values.age);
      form_data.append("height", values.height);
      form_data.append("isWildcard", isWildcard);
      const { data } = await axiosInstance.post("/actress", form_data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setWinners([...winners, data.message]);
      toast({
        title: "Contestants Added Successfully",
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
          <span className="hidden md:block">ADD NEW CONTESTANT</span>
          <Plus className="md:hidden" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="text-grad text-xl font-semibold">
          ADD NEW CONTESTANT
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Age</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Height</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="text-base">Upload Image</Label>

              <Input
                id="picture"
                type="file"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                  }
                }}
                className="file:bg-blue-50 file:text-grad hover:file:bg-blue-100 border-0 mt-0"
              />
            </div>

            <Button variant="grad" size={"full"} type="submit">
              {isLoading ? "Wait.." : "Add Contestant"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
