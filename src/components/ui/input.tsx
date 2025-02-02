import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <>
        {type != "file" ? (
          <div className="bg-grad px-[2px] py-[2px] rounded-[5px] ">
            <input
              type={type}
              className={cn(
                "flex h-[50px] w-full rounded-[5px] border border-input bg-black px-3 py-2 text-base  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none border- disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              ref={ref}
              {...props}
            />
          </div>
        ) : (
          <input
            type={type}
            className={cn(
              "flex h-[50px] w-full rounded-[5px] border border-input bg-black px-3 py-2 text-base  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none border- disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
        )}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
