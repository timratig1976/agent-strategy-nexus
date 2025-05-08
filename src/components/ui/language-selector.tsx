
import * as React from "react";
import { Check, GlobeIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OutputLanguage } from "@/services/ai/types";

const languages = [
  { value: "deutsch", label: "Deutsch" },
  { value: "english", label: "English" },
];

interface LanguageSelectorProps {
  value: OutputLanguage;
  onChange: (value: OutputLanguage) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = React.useState(false);
  
  // Make sure we have a valid value, defaulting to "english"
  const safeValue = value && languages.some(lang => lang.value === value) 
    ? value 
    : "english";

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[180px] justify-between"
          >
            <div className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4" />
              {languages.find((language) => language.value === safeValue)?.label || "Select language"}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <CommandEmpty>No language found</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue as OutputLanguage);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      safeValue === language.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
