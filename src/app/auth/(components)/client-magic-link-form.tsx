"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { RainbowButton } from "@/components/ui/rainbow-button";

const ClientMagicLinkForm = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setEmail(email);
    setIsEmailValid(validateEmail(email));
  };

  const handleEmailBlur = () => {
    setMessage('');
    setMessageType('');
  };

  const handleEmailFocus = () => {
    setMessage('Note: Sign-in with email is currently limited to some users.');
    setMessageType('info');
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
        onBlur={handleEmailBlur}
        onFocus={handleEmailFocus}
        style={{ borderColor: '#ccc', borderWidth: '1px', position: 'relative', zIndex: 1 }}
      />

        <RainbowButton type="submit" className={`w-full ${isEmailValid ? "" : "disabled"}`}>
          <Mail size={20} className="mr-2" />
          Sign in with Email
        </RainbowButton>

      {message && (
        <p className={`mt-2 text-center text-sm ${messageType === 'error' ? 'text-red-500' : 'text-xs text-gray-500 italic text-center'}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default ClientMagicLinkForm;
