"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";

const ClientMagicLinkForm = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setEmail(email);
    setIsEmailValid(validateEmail(email));
    setMessage('');
    setMessageType('');
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEmailValid) {
      const res = await signIn("resend", { email, redirect: false });
      if (res?.error) {
        setMessage("Failed to send magic link");
        setMessageType("error");
        return;
      }
      setMessage("Check your email for the magic link");
      setMessageType("success");
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
        className="w-full mb-4 p-2 border rounded bg-transparent text-black"
        style={{ borderColor: '#ccc', borderWidth: '1px' }}
      />
      <button
        type="submit"
        className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-white ${isEmailValid ? 'bg-themeColor hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
        disabled={!isEmailValid}
      >
        <Mail size={20} />
        Sign in with Email
      </button>
      {message && (
        <p className={`mt-4 text-center text-sm ${messageType === 'error' ? 'text-red-500' : 'text-muted-foreground'}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default ClientMagicLinkForm;
