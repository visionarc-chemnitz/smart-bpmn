"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { apiWrapper } from '@/lib/utils';
import { updateUserName } from "@/app/dashboard/_actions/dashboard"
import { useRouter } from "next/navigation"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

// Organization schema
const renameSchema = z.object({
  name: z.string().min(1, "Profile name is required").trim(),
})

export function RenameModal() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setOpen(true);
    }, 10);
  };


  const form = useForm<z.infer<typeof renameSchema>>({
    resolver: zodResolver(renameSchema),
    defaultValues: {
      name: ""
    },
  });


  const onSubmit = async (data: z.infer<typeof renameSchema>) => {
    try {
      startTransition(async () => {
        const response = await updateUserName(data.name)

        if (response === true) {
          toast.success("Profile Name has been updated.");
          setOpen(false);
          
          router.refresh();
        } else {
          toast.error("Something went wrong!");
        }

      });
    } catch (error: any) {
      toast.error("Something went wrong!" + error);
    } finally {
      form.reset({name: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
      <InteractiveHoverButton className='dark:bg-white dark:text-black bg-black text-white'>
        Get Started
      </InteractiveHoverButton>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add Profile Name</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
          Give a name to your profile. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
            <FormLabel className="dark:text-gray-200">Profile Name</FormLabel>
            <FormControl>
              <Input 
              {...field} 
              placeholder="John Doe" 
              type="text"
              className="dark:bg-gray-800 dark:text-white dark:border-gray-700" 
              />
            </FormControl>
            <FormMessage className="dark:text-red-400" />
            </FormItem>
          )}
          />
        </div>
        <DialogFooter>
          <Button 
          type="submit" 
          disabled={isPending}
          className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
          {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
        </form>
      </Form>
      </DialogContent>
    </Dialog>
  )
}
