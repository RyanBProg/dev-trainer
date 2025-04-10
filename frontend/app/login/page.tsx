"use client";

import { useState } from "react";
import Link from "next/link";
import RootLayoutWrapper from "@/components/root/RootLayoutWrapper";
import { userLoginSchema } from "@/utils/zod/formSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import googleIcon from "@/public/assets/icons/googel-icon.png";
import { SubmitHandler, useForm } from "react-hook-form";
import { TUserLogin } from "@/utils/types/types";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<TUserLogin>();

  async function login(email: string, password: string) {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "An error occurred during login");
      }

      setIsLoading(false);
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to login";
      toast.error(message);
      setIsLoading(false);
    }
  }

  const onSubmit: SubmitHandler<TUserLogin> = async (data) => {
    const result = userLoginSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.errors[0].message || "Something went wrong");
      return;
    }

    await login(result.data.email, result.data.password);
  };

  return (
    <RootLayoutWrapper>
      <div className="pt-20">
        <h1 className="text-center font-bold text-3xl pb-12">User Login</h1>
        <Link
          href={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/oauth-signin`}
          className="btn btn-primary flex gap-4 w-96 mx-auto">
          <Image src={googleIcon} alt="google icon" height={24} width={24} />
          <span>Sign In with Google</span>
        </Link>
        <div className="mx-auto my-16 text-center flex justify-center  items-center gap-3">
          <div className="h-px w-10 bg-white"></div>
          <span>OR</span>
          <div className="h-px w-10 bg-white"></div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto w-96 grid gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Email"
              required
              {...register("email")}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="Password"
              required
              {...register("password")}
            />
          </label>
          <button type="submit" className="btn btn-active btn-accent">
            {isLoading ? <LoadingSpinner size="md" /> : "Login"}
          </button>
        </form>
        <span className="block text-center pt-8">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline hover:text-gray-300">
            Sign Up
          </Link>
        </span>
      </div>
    </RootLayoutWrapper>
  );
}
