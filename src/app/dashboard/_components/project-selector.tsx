"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function ProjectSelector() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {/* SearchBar to find among the projects */}
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select project..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search project..." className="h-9" />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
                <ScrollArea className="h-[200px] w-full" style={{ '--scrollbar-size': '4px' } as React.CSSProperties}>
                {frameworks.map((framework) => (
                  <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  >
                  {framework.label}
                  <Check
                    className={cn(
                    "ml-auto",
                    value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  </CommandItem>
                ))}
                </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
