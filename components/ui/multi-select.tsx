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
  placeholder?: string
}

function MultiSelect({ options, selected, onChange, className, placeholder, ...props }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between items-center flex border border-input bg-background text-sm ring-offset-background', // Base styles to mimic an input
            'h-12', // Standardized height
            selected.length > 0 && 'h-auto', // Allow height to grow if items are selected
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', // Standard focus styles from ShadCN
            'focus:border-brand-primary-blue focus:ring-brand-primary-blue/20', // Custom focus styles
            'rounded-md px-3 py-2', // Standard padding and rounding
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap items-center">
            {selected.length === 0 && (
              <span className="text-muted-foreground">{placeholder || 'Select options...'}</span>
            )}
            {selected
              .map((value) => options.find((option) => option.value === value))
              .filter((option): option is Framework => option !== undefined)
              .map((option) => (
                <Badge
                  key={option.value}
                  className="bg-brand-primary-blue/10 text-brand-primary-blue hover:bg-brand-primary-blue/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(option.value)
                  }}
                >
                  {option.label}
                  <X className="ml-2 h-4 w-4 text-brand-primary-blue/70 hover:text-brand-primary-blue transition-colors" />
                </Badge>
              ))}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white">
        <Command className={className}>
          <CommandInput placeholder="Search courses..." />
          <CommandList>
            <CommandEmpty>No courses found.</CommandEmpty>
            <CommandGroup className="max-h-[150px] overflow-y-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  className=" cursor-pointer"
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
