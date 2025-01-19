"use client";

import { toast } from "@/hooks/use-toast";

class ToastService {
    showDefault(description: string) {
        toast({
            title: "Success",
            description,
        });
    }

    showDestructive(description?: string) {
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description,
        });
    }
}

export const toastService = new ToastService();
