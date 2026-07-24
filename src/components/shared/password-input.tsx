import { useState } from "react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { InputProps } from "@/components/ui/input";

export function PasswordInput(props: Omit<InputProps, "type">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput type={showPassword ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
