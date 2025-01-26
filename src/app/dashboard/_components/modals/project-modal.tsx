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
import { useState, useTransition } from "react"
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
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Project } from "@/types/project/project"
import { saveProject } from "@/app/dashboard/_actions/dashboard"
import { Separator } from "@/components/ui/separator"

// Project schema
const projSchema = z.object({
  projName: z.string().min(1, "Project name is required").trim(),
  orgId: z.string().min(1, "Organization ID is required").trim(),
})

interface ProjModalProps {
  orgId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ProjectModal({ orgId, open, setOpen }: ProjModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof projSchema>>({
    resolver: zodResolver(projSchema),
    defaultValues: {
      projName: "",
      orgId: orgId 
    },
  });


  const onSubmit = async (data: z.infer<typeof projSchema>) => {
    try {
      startTransition(async () => {
        const response:Project = await saveProject(data.projName, data.orgId)

        if (response && typeof response === 'object') {
          toast.success("New Project created.");
          setOpen(false);          
          console.log(response);

          router.refresh();
        } else {
          toast.error("Something went wrong!");
        }

      });
    } catch (error: any) {
      toast.error("Something went wrong!" + error);
    } finally {
      form.reset({projName: "" });
    }
  };

  return (
    <div className="project-modal">
      <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <div className="flex w-full items-start gap-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Plus size={16} />
            New Project
          </Button>
          </div>
        {/* <InteractiveHoverButton className='dark:bg-white dark:text-black bg-black text-white'>
          Get Started
        </InteractiveHoverButton> */}
        </DialogTrigger>
        <Separator className="mt-2"/>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="dark:text-white">New project</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
            Give a name to your project. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FormField
            control={form.control}
            name="projName"
            render={({ field }) => (
              <FormItem>
              <FormLabel className="dark:text-gray-200">Project Name</FormLabel>
              <FormControl>
                <Input 
                {...field} 
                placeholder="employee-portal" 
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
            variant="default" 
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
    </div>
  )
}
