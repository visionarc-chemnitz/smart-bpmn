import { SignInButton } from "./signin-button";
import { MagicLinkButton } from "./magiclink-button";

export default function SignIn() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-lg border p-6 shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Choose your preferred sign in method
        </p>
      </div>
      
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
  );
} 