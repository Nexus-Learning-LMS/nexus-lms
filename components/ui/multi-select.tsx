'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check, X, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export interface Framework {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Framework[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

function MultiSelect({ options, selected, onChange, className, ...props }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${selected.length > 1 ? 'h-full' : 'h-10'}`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length === 0 && <span>Select courses...</span>}
            {selected
              .map((value) => options.find((option) => option.value === value))
              .filter((option): option is Framework => option !== undefined)
              .map((option) => (
                <Badge
                  variant="secondary"
                  key={option.value}
                  className="mr-1 mb-1"
                  onClick={(e) => {
                    e.stopPropagation() // prevent opening the popover
                    handleUnselect(option.value)
                  }}
                >
                  {option.label}
                  <X className="ml-1 h-4 w-4 cursor-pointer" />
                </Badge>
              ))}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandInput placeholder="Search courses..." />
          <CommandList>
            <CommandEmpty>No courses found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value],
                    )
                    setOpen(true)
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', selected.includes(option.value) ? 'opacity-100' : 'opacity-0')}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
