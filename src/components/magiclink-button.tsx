import { signIn } from "@/auth"
import { Mail } from "lucide-react"

export function MagicLinkButton() {
  return (
    <form
        action={async (formData) => {
          "use server"
          await signIn("resend", formData)
        }}
      >
        <input type="text" name="email" placeholder="Email" />
        <button
          type="submit" 
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Mail size={20} />
          Sign in with Email
        </button>
      </form> 
  )
}