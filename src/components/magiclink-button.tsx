"use client";
import { useState } from "react";
import { signIn } from "@/auth";
import { Mail } from "lucide-react";

export function MagicLinkButton() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleEmailChange = (event) => {
    const email = event.target.value;
    setEmail(email);
    setIsEmailValid(validateEmail(email));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isEmailValid) {
      await signIn("resend", { email });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        name="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        type="submit"
        className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-white ${isEmailValid ? 'bg-themeColor hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
        disabled={!isEmailValid}
      >
        <Mail size={20} />
        Sign in with Email
      </button>
    </form>
  );
}