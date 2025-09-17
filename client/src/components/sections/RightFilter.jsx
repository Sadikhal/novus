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
        <Button className='md:h-8 h-7 rounded-sm bg-lamaWhite border border-slate-200 md:btn-wide flex items-center text-black capitalize font-robotos hover:bg-[#e6edf1d3] justify-between md:text-sm text-xs px-2 md:px-5'>
          <div className='font-poppins'>
            sort by : <span className= 'font-semibold px-2 md:text-sm text-xs'>{
              sortingOptions.find(opt => opt.value === filters.sortBy)?.label || 'Recommended'
            }</span>
          </div>
          <LucideChevronDown className='font-normal text-xs text-gray-600' />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-38 md:w-48 bg-lamaWhite p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandList>
            <CommandGroup >
              {sortingOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center justify-between px-2 md:px-3 text-nowrap py-2 text-black cursor-pointer hover:bg-[#3c9b89d3] text-[12px] font-medium font-robotos sm:text-[14px]"
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