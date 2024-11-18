
import { signIn } from "@/auth"
import { FcGoogle } from "react-icons/fc"
 
export function GoogleSignInButton() {
  return (
    <form
    action={async () => {
      "use server"
      await signIn("google", { redirectTo: "/dashboard" })
    }}
  >
    <button 
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
    >
      <FcGoogle/>
      Sign in with Google
      </button>
    </form>
  )
}