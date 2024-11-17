
import { signIn } from "@/auth"
import { Github } from "lucide-react"
 
export function SignInButton() {
  return (
    <form
    action={async () => {
      "use server"
      await signIn("github", { redirectTo: "/dashboard" })
    }}
  >
    <button 
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
    >
      <Github size={20} />
      Sign in with GitHub
      </button>
    </form>
  )
}