import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { useLogin } from "@/hooks/auth/useLogin";
import { cn } from "@/lib/utils";

import { Input } from "../ui/input";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password required"),
});

function Form() {
  const { mutate, isError, isPending: loading } = useLogin();

  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isError)
      toast.error("Uh oh! something went wrong.", {
        description: isError,
        // onDismiss: () => dispatch(clear_auth_errors()),
        // onAutoClose: () => dispatch(clear_auth_errors()),
      });
  }, [isError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      authSchema.parse({ email, password });

      mutate({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormError(error.errors[0].message);
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="z-10 mx-12 flex flex-1 flex-col items-center justify-center gap-8 font-['Poppins']">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl text-black">Log in</h1>
        <p className="text-gray-500">To access your account</p>
      </div>

      <form
        className="flex w-full flex-col items-center gap-6 dark:text-black"
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <div className="flex w-full flex-col">
          <label htmlFor="email" className="text-gray-500">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 rounded-full border py-6 outline-none"
          />
        </div>

        {/* Password */}
        <div className="flex w-full flex-col">
          <div className="flex w-full justify-between text-gray-500">
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className={cn(
                "flex w-[72px] items-center justify-between gap-2",
                {
                  "text-[#023F30]": hidePassword,
                },
              )}
              onClick={() => setHidePassword((prev) => !prev)}
            >
              {hidePassword ? <Eye /> : <EyeOff size={20} />}
              <span>{hidePassword ? "Show" : "Hide"}</span>
            </button>
          </div>

          <Input
            id="password"
            type={hidePassword ? "password" : "text"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 rounded-full border py-6 outline-none"
          />
          <Link to="/auth" className="mt-2 text-center underline">
            I forgot my password
          </Link>
        </div>

        {formError && <p className="text-red-500">{formError}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "mt-6 w-72 rounded-full bg-[#023F30] p-4 text-xl text-white",
            {
              "bg-gray-400": loading,
            },
          )}
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default Form;
