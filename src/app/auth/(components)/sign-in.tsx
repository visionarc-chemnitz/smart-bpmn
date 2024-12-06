import { signIn, providerMap } from "@/auth";
import { MagicLinkButton } from "./magiclink-button";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import ToggleButton from "@/app/shared/{components}/toggle-btn";


export default function SignIn() {

  return (
    <div className="flex h-screen items-center justify-center p-">
      <div className="absolute top-4 right-4">
        <ToggleButton />
      </div>
      <div className="flex flex-col sm-max:flex-col md:flex-row w-full max-w-4xl h-auto md:h-[500px] rounded-lg border shadow-lg">
        <div className="hidden sm-max:hidden md:flex flex-col justify-between w-1/2 rounded-l-lg bg-signinCard p-6 text-white">
          <div>
            <h1 className="text- mt-12 mb-4 ml-4">Welcome back,</h1>
            <h2 className="text-xl ml-4">Let&apos;s streamline business processes.</h2>
          </div>
        </div>
        <div className="flex flex-col justify-center w-full md:w-1/2 rounded-r-lg space-y-4 p-6 bg-white">
          <div className="text-center">
            <img src="/assets/img/logo/vision_arc_logo_transparent.png" alt="Logo" className="mx-auto mb-4 h-20 w-24 rounded-full object-cover" />
            <p className="text-sm text-muted-foreground">
              Choose your preferred sign in method
            </p>
          </div>

          {providerMap.map((provider) => {
            if (provider.id === "resend") return;
            const Icon = provider.icon;
            return (
              <form
                key={provider.id}
                action={async () => {
                  "use server";
                  await signIn(provider.id,{
                    redirectTo: "/dashboard",
                  });
                }}
              >
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800">
                  {Icon && <Icon className="mr-2" />}
                  <span>Sign in with {provider.name}</span>
                </button>
              </form>
            );
          })}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <MagicLinkButton />
        </div>
      </div>
    </div>
  );
}
