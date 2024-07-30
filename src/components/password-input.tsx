import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye,EyeOff } from "lucide-react";
import React, { useState } from "react";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, ...props},ref ) => {
        const [showPassword, setShowPassword] = useState<boolean>(false);

        return (
           <div className="relative w-full">
            <Input type={showPassword ? "text" : "password"} className={cn('', className)} ref={ref} {...props} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} title={showPassword ? 'Cacher le Password' : 'Montrer le Password'} className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground cursor-pointer">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
           </div> 
        )
    }
)

PasswordInput.displayName = "PasswordInput";

export {PasswordInput}