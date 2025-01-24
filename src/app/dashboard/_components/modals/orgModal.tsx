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
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function OrgModal() {
  const [open, setOpen] = useState<boolean>(false)
  const [orgName, setOrgName] = useState<string>("")
  const [projName, setProjName] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your submission logic here
    console.log({ orgName, projName })
    setOpen(false)
    // Reset form
    setOrgName("")
    // setProjName("")
  }

  // Handle organization submission
      // const handleOrganizationSubmit = async (e: React.FormEvent) => {
      //     e.preventDefault();
  
      //     if (!user || !user.id) {
      //         toastService.showDestructive('User is not logged in or user ID is missing');
      //         return;
      //     }
  
      //     if (!organizationName) {
      //         toastService.showDestructive('Organization name is required');
      //         return;
      //     }
  
      //     const requestBody = {
      //         organizationName,
      //         createdBy: user.id,
      //     };
  
      //     try {
      //         setIsLoading(true);
      //         const response = await fetch(API_PATHS.SAVE_ORGANIZATION, {
      //             method: 'POST',
      //             headers: { 'Content-Type': 'application/json' },
      //             body: JSON.stringify(requestBody),
      //         });
  
      //         if (!response.ok) {
      //             const errorData = await response.json();
  
      //             throw new Error('Error creating organization');
      //         }
  
      //         const data = await response.json();
      //         setOrganizations(data);
      //         setCurrentOrganization(data);
      //         closeModal();
      //         toastService.showDefault('Organization has been created.');
      //         window.location.reload();
      //     } catch (error) {
      //         console.error('Error creating organization:', error);
      //     } finally {
      //         setIsLoading(false);
      //     }
      // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Get Started</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
            <DialogDescription>
              Give name to your organization & project save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orgName" className="text-right">
                Organization
              </Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="col-span-3"
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projName" className="text-right">
                Project
              </Label>
              <Input
                id="projName"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                className="col-span-3"
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
