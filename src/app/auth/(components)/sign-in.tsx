"use client"
import { MagicLinkButton } from "./magiclink-button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import FloatingFigures from "@/components/ui/floating-figures";
import { useToggleButton } from "@/hooks/use-toggle-button";
import { providerMap } from "@/auth";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function SignIn() {
  const { toggleButton } = useToggleButton()
  const handleSignIn = async (providerId: string) => {
    await signIn(providerId, { redirectTo: "/dashboard" });
  };
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get('invitationToken');
  const [acceptInvitationSuccessful, setacceptInvitationSuccessful] = useState(false);
  

  useEffect(() => {
    if (invitationToken) {  
      localStorage.setItem('invitationToken', invitationToken);
    }
   
  }, [invitationToken]);

  return (
    <div className="flex h-screen items-center justify-center p-">
      <FloatingFigures />
      <div className="absolute top-4 right-4">
        {toggleButton()}
      </div>
      <div className="flex flex-col sm-max:flex-col md:flex-row w-full max-w-4xl h-auto md:h-[500px] rounded-lg border-2 shadow-lg">
        <div className="hidden sm-max:hidden md:flex flex-col justify-between w-1/2 rounded-l-lg p-6 bg-gradient-to-br from-[#0ea5e9] via-[#0284c7] to-[#0369a1] text-white">
          <div>
              <h1 className="text-lg mt-12 mb-4 ml-4">Welcome,</h1>
              <h2 className="text-xl ml-4">Let&apos;s bring your processes to life.</h2>

              <div className="text-sm mt-8 ml-4">
                <ul className="list-none text-gray-300">

                <li className="flex items-start mt-2">
                    <span className="mr-2 text-xs">→</span>
                    <span>Convert images into process maps in seconds.</span>
                  </li>

                  <li className="flex items-start mt-2">
                    <span className="mr-2 text-xs">→</span>
                    <span>Effortlessly create BPMN from text prompts.</span>
                  </li>

                  <li className="flex items-start mt-2">
                    <span className="mr-2 text-xs">→</span>
                    <span>Simplify complex processes with intuitive tools.</span>
                  </li>

                  <li className="flex items-start mt-2">
                    <span className="mr-2 text-xs">→</span>
                    <span>Save time, focus on what truly matters.</span>
                  </li>
                </ul>
              </div>
          </div>
        </div>
          <div className="flex flex-col justify-center w-full md:w-1/2 rounded-r-lg bg-gray-50 dark:bg-gray-900 space-y-4 p-6 bg ">
              <div className="text-center">
                <Image src="/assets/img/logo/vision_arc_logo_transparent.png" alt="Logo" className="mx-auto mb-4 h-20 w-24 rounded-full object-cover" />
                <p className="text-sm text-muted-foreground">
                      Choose your preferred sign in method
                </p>
              </div>

              {providerMap.map((provider) => {
                if (provider.id === "sendgrid") return;
                const Icon = provider.icon;
                return (
                  <form
                    key={provider.id}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSignIn(provider.id);
                    }}
                  >
                    <RainbowButton type="submit" className="w-full">
                      {Icon && <Icon className="mr-2" />}
                      <span>Sign in with {provider.name}</span>
                    </RainbowButton>
                  </form>
                );
              })}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
            <MagicLinkButton />
          </div>
      </div>
    </div>
  );
}
