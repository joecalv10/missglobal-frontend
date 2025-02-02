import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import { setCookie } from "cookies-next";
import { login } from "@/store/slices/authSlice";
import Loading from "./Loading";

// Define the form schema with zod
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Define the submit handler
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();

    setIsLoading(true);
    try {
      // API call to the login route
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`, // Use the backend API URL from the .env file
        {
          email: values.username,
          password: values.password,
        }
      );

      // Set cookies for access token and refresh token
      setCookie("accessToken", data.message.accesstoken, {
        expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        path: "/",
      });
      setCookie("refreshToken", data.message.refreshtoken, {
        expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        path: "/",
      });
      dispatch(login(true));

      // Show success toast
      toast({
        title: "Login Successful",
      });

      // Redirect based on role
      if (data.message.role === "ADMIN") {
        router.push("/admin/judges");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error(err);
      // Show error toast
      if (err.response) {
        toast({
          title: err.response.data.message,
        });
      } else {
        toast({
          title: err.message,
        });
      }
    }
  }

  return (
    <>
      <Loading />

      <div className="px-[25px] pt-[30px] max-w-[450px] m-auto mt-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@missglobal.com" {...field} />
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
              {isLoading ? "Wait.." : "Get In"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
