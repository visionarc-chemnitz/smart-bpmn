import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  const user = {
    image: session?.user?.image ?? "", // Safely handle undefined image
    name: session?.user?.name ?? "Anonymous", // Default fallback for name
    email: session?.user?.email ?? "No email provided", // Default fallback for email
    lastLogin: "2024-11-18 12:45 PM", // Placeholder last login
    status: "Active", // Example static field
  };

  return (


<div className="px-4 py-8">
<div className="max-w-7xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          {/* Header Section */}
          <CardHeader className="flex flex-col items-center text-center">
            <img
              src={user.image}
              alt="User"
              className="w-24 h-24 rounded-full border-4 border-gray-300 dark:border-gray-600"
            />
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
              {user.name}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {user.email}
            </CardDescription>
          </CardHeader>

          {/* Content Section */}
          <CardContent className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Organization
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                VisionArc
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Login
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {user.lastLogin}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <p
                className={`mt-1 font-semibold ${
                  user.status === "Active"
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {user.status}
              </p>
            </div>
          </CardContent>

          {/* Footer Section */}
          <CardFooter className="text-center">
            <RainbowButton>Get Unlimited Access</RainbowButton>
          </CardFooter>
        </Card>
    {/* Add more cards as needed */}
  </div>
</div>
</div>
  );
}