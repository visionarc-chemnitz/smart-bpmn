import { GoogleSignInButton } from "./google-signin-button";
import { SignInButton } from "./signin-button";
import { MagicLinkButton } from "./magiclink-button";

export default function SignIn() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-full max-w-3xl rounded-lg border shadow-lg">
        <div className="flex flex-col justify-center w-1/2 rounded-l-lg bg-themeColor"></div>
        <div className="flex flex-col justify-center w-1/2 space-y-4 p-6">
          <div className="text-center">
            <img src="/assets/img/logo/vision_arc_logo_transparent.png" alt="Logo" className="mx-auto mb-4 h-20 w-24 rounded-full object-cover" />
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Choose your preferred sign in method
            </p>
          </div>

          <GoogleSignInButton />
          <SignInButton />

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