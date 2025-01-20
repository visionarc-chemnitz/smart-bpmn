import { Suspense } from "react";
import SignIn from "../(components)/sign-in";
import Loading from "@/app/loading";
 
export default async function SignInPage() {
  
  return (

    // TODO: redirect to dashboard if user is already signed in
    // TODO: Revamp the sign-in page
    <Suspense fallback={<Loading/>}>
      <SignIn/>
    </Suspense>
  );
}
