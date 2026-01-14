"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthUser } from "../../../context/AuthUserContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Signin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("from"); // 👈 received here

  const { loginUser, currentUser, loading } = useAuthUser();

  const [checkedSession, setCheckedSession] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (!loading) {
      setCheckedSession(true);

      if (currentUser) {
        toast.success("You are already logged in");

        // 🔥 Perfect redirect rule
        if (redirectTo && redirectTo !== "/login") {
          router.replace(redirectTo);
        } else {
          router.replace("/profile"); // fallback
        }
      }
    }
  }, [loading, currentUser, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    try {
      await loginUser(email, password);

      // 🔥 After successful login — go back where user came from
      if (redirectTo && redirectTo !== "/login") {
        router.replace(redirectTo);
      } else {
        router.replace("/profile");
      }

    } catch {
      setDisabled(false);
    }
  };

  if (!checkedSession) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        Checking session…
      </div>
    );
  }
// font-[SF_Ironside] 
  return (
    <div className="flex  tracking-widest bg-[url('/backdrop_login.png')]  items-center justify-center min-h-[100vh] bg-cover bg-center px-2 sm:px-5">
      <div className=" shadow-2xl border  p-10 w-full max-w-lg bg-black/95  animate-fade-in">
        <h3
        style={{ fontFamily: "'Cinzel Decorative', serif" }} 
        className="text-3xl   sm:text-4xl text-white text-center font-extrabold mb-8">Welcome Back</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* EMAIL FIELD */}
          <div className="flex flex-col gap-2">
            <label className="text-sm tracking-widest text-white">
            Email ID
          </label>
          
          <div className="relative">
            {/* write label for email label for email  */}
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={20} />
            <input
              type="email"
              placeholder="Email your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-xl  text-white bg-[#141414] outline-none border-2 border-transparent 
                  focus:border-white  focus:ring-white placeholder-white"
              required
            />
          </div>
          </div>

          {/* PASSWORD FIELD */}
          <div className="flex flex-col gap-2">
            <label className="text-sm tracking-widest text-white">
            Password
          </label>
          <div className="relative">
            {/* write label for password  */}
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={20} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 text-xl py-3 text-white bg-[#141414] outline-none border-2 border-transparent 
                  focus:border-white placeholder-white"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          </div>

          {/* 👉 FORGOT PASSWORD OPTION */}
          <p
            onClick={() => router.push("/forgot-password")}
            className="text-right text-md sm:text-lg text-white font-semibold cursor-pointer hover:underline -mt-3"
          >
            Forgot Password?
          </p>

         {/* login button  */}

<button
  type="submit"
  disabled={isDisabled}
  style={{ backgroundImage: "url('/button_login.png')" }}
  className="
    w-full h-16
    bg-cover bg-center
    rounded-xl
    transition hover:scale-105
    disabled:opacity-50
  "
>
  <span className="text-white text-2xl font-bold tracking-widest
    drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]
  ">
    {isDisabled ? "Signing In..." : "SIGN IN"}
  </span>
</button>


        </form>

        {/* Redirect */}
        <p className="mt-6 text-md md:text-lg text-center text-white">
          Don’t have an account?
          <span
            onClick={() => router.push("/register")}
            className="font-semibold text-lg md:text-xl cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
