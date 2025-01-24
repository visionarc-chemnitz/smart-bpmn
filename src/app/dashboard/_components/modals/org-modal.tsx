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
import { apiWrapper } from '@/lib/utils';
import { saveOrganization } from "@/app/dashboard/_actions/dashboard"
import { useRouter } from "next/navigation"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

// Organization schema
const orgSchema = z.object({
  orgName: z.string().min(1, "Organization name is required").trim(),
})

export function OrgModal() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      orgName: ""
    },
  });


  const onSubmit = async (data: z.infer<typeof orgSchema>) => {
    try {
      startTransition(async () => {
        const response = await saveOrganization(data.orgName)

        if (response === true) {
          toast.success("Organization has been created.");
          setOpen(false);
          
          router.refresh();
        } else {
          toast.error("Something went wrong!");
        }

      });
    } catch (error: any) {
      toast.error("Something went wrong!" + error);
    } finally {
      form.reset({orgName: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <InteractiveHoverButton className='dark:bg-white dark:text-black bg-black text-white'>
        Get Started
      </InteractiveHoverButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add Organization</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
          Give a name to your organization. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FormField
          control={form.control}
          name="orgName"
          render={({ field }) => (
            <FormItem>
            <FormLabel className="dark:text-gray-200">Organization Name</FormLabel>
            <FormControl>
              <Input 
              {...field} 
              placeholder="Acme.Inc" 
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
