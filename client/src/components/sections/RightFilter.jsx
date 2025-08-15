import React from 'react'
import { HoverCard,HoverCardTrigger,HoverCardContent } from '../ui/HoverCard'
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/Command'
import { cn } from "../../lib/utils"
import { Button } from '../ui/Button'
import { Check, LucideChevronDown } from 'lucide-react'

const sortingOptions = [
  {
    value: "price-lowtohigh",
    label: "Price: Low to High",
  },
  {
    value: "price-hightolow",
    label: "Price: High to Low",
  },
  {
    value: "newest",
    label: "Newest",
  },
]

const RightFilter = ({filters, setFilters}) => {
  const handleSelect = (value) => {
    setFilters(prev => ({...prev, sortBy: value}))
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button className='h-10 rounded-none bg-lamaWhite border border-slate-200 btn-wide flex items-center text-black capitalize font-robotos hover:bg-[#c8e1f2d3] justify-between text-sm'>
          <div className='font-poppins'>
            sort by: <span className= ' font-bold px-2 text-sm'>{
              sortingOptions.find(opt => opt.value === filters.sortBy)?.label || 'Recommended'
            }</span>
          </div>
          <LucideChevronDown className='font-normal text-gray-600' />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 bg-lamaWhite p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandList>
            <CommandGroup >
              {sortingOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center justify-between px-4 py-2 text-black  cursor-pointer hover:bg-[#3c9b89d3] font-robotos "
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      filters.sortBy === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </HoverCardContent>
    </HoverCard>
  )
}

export default RightFilter