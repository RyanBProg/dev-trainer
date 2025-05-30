"use client";

import { useState } from "react";
import Link from "next/link";
import RootLayoutWrapper from "@/components/root/RootLayoutWrapper";
import { userSignupSchema } from "@/utils/zod/formSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { useRouter } from "next/navigation";
import { TUserSignup } from "../../utils/types/types";
import Image from "next/image";
import googleIcon from "@/public/assets/icons/googel-icon.png";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Signup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<TUserSignup>();

  async function signup(signupData: TUserSignup) {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: signupData.fullName,
            email: signupData.email,
            password: signupData.password,
            confirmPassword: signupData.confirmPassword,
          }),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "An error occurred during sign up");
      }

      setIsLoading(false);
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign up";
      toast.error(message);
      setIsLoading(false);
    }
  }

  const onSubmit: SubmitHandler<TUserSignup> = async (data) => {
    const result = userSignupSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.errors[0].message || "Something went wrong");
      return;
    }

    await signup(result.data);
  };

  return (
    <RootLayoutWrapper>
      <div className="pt-20">
        <h1 className="text-center font-bold text-3xl pb-12">User Sign Up</h1>
        <Link
          href={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/oauth-signin`}
          className="btn btn-primary flex gap-4 w-96 mx-auto">
          <Image src={googleIcon} alt="google icon" height={24} width={24} />
          <span>Sign Up with Google</span>
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
              placeholder="Full Name"
              required
              {...register("fullName")}
            />
          </label>
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
              placeholder="Confirm Password"
              required
              {...register("confirmPassword")}
            />
          </label>
          <button type="submit" className="btn btn-active btn-accent">
            {isLoading ? <LoadingSpinner size="md" /> : "Sign Up"}
          </button>
        </form>
        <span className="block text-center pt-8">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-gray-300">
            Login
          </Link>
        </span>
      </div>
    </RootLayoutWrapper>
  );
}
