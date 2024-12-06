"use client";

import { ChevronDown, Mail } from "lucide-react";
import { useToggleButton } from '@/hooks/use-toggle-button'

import { Button } from "@/components/ui/button";

const ToggleButton = () => {
  const { toggleButton, logoSrc } = useToggleButton()
    return (
      <div>
        {toggleButton()}
        <Button
        variant="ghost" 
        size="icon"
        className="md:hidden hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
        >
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${'rotate-180'}`} />
        </Button>
      </div>
    );
}

export default ToggleButton;