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
import { saveFile } from "@/app/dashboard/_actions/dashboard"
import { useRouter } from "next/navigation"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Bpmn } from "@/types/bpmn/bpmn"
import { ClipboardList } from "lucide-react"

// Bpmn file schema
const fileSchema = z.object({
  fileName: z.string().min(1, "File name is required").trim(),
  projId: z.string().min(1, "Project ID is required").trim(),
})

interface NewFileModalProps {
  currentprojId: string;
}
export function NewFileModal({currentprojId}: NewFileModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      fileName: "",
      projId: currentprojId
    },
  });


  const onSubmit = async (data: z.infer<typeof fileSchema>) => {
    try {
      startTransition(async () => {
        const response:Bpmn = await saveFile(data.fileName, data.projId)

        if (response && typeof response === 'object') {
          toast.success("New File created.");
          setOpen(false);          

          router.push(`/dashboard/chat/${response.id}`);
        } else {
          toast.error("Something went wrong!");
        }

      });
    } catch (error: any) {
      toast.error("Something went wrong!" + error);
    } finally {
      form.reset({fileName: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 dark:bg-white dark:text-black bg-black text-white hover:bg-black">
          <ClipboardList size={16} />
          New File
        </Button>
      {/* <InteractiveHoverButton className='dark:bg-white dark:text-black bg-black text-white'>
        Get Started
      </InteractiveHoverButton> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle className="dark:text-white">New File</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
          Give a name to your file. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FormField
          control={form.control}
          name="fileName"
          render={({ field }) => (
            <FormItem>
            <FormLabel className="dark:text-gray-200">File Name</FormLabel>
            <FormControl>
              <Input 
              {...field} 
              placeholder="pizza-order-bpmn" 
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
          className="dark:bg-white dark:text-black dark:hover:bg-gray-200"
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
