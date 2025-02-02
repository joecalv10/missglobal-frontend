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
import axiosInstance from "@/utils/axiosInterceptor";

const formSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  age: z.string().optional(),
  height: z.string().optional(),
});

interface modalProps {
  setOpen: any;
  actress: any;
  contestents:any,
  setContestents:any,
}

const EditJudgeForm = ({ setOpen, actress, contestents, setContestents }: modalProps) => {
  //   const [open, setOpen] = useState(openModal);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  //   useEffect(() => {
  //     console.log("PRop", openModal);
  //     console.log("modal state", editCModal);
  //   }, [openModal, editCModal]);

  const [file, setFile] = useState<any>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: actress?.name || "", 
      country: actress?.country || "",
      age: actress?.age?.toString() || "",
      height: actress?.height || "",
  }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form_data = new FormData();
      if (file) form_data.append("file", file);

      // Check each value before appending
      if (values.name) form_data.append("name", values.name);
      if (values.country) form_data.append("country", values.country);
      if (values.age) form_data.append("age", values.age.toString());
      if (values.height) form_data.append("height", values.height);

      const { data } = await axiosInstance.patch("/actress/"+actress._id, form_data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      
      setContestents(contestents.map((actress:any)=>{
        if(actress._id == data.message._id){
          actress.name= data.message.name, 
          actress.country= data.message.country,
          actress.age= data.message.age,
          actress.height= data.message.height,
          actress.pic = data.message.pic
        } 

        return actress;
      }))

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
    <div>
      <div className="text-grad text-xl font-semibold">EDIT CONTESTANT</div>
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
            {isLoading ? "Wait.." : "Edit Contestant"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditJudgeForm;
