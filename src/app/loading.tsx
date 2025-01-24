import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <Loader className="animate-spin" />
    </div>
  );
}
