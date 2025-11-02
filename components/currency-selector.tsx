"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Currency {
    code: string
    name: string
    symbol: string
    countries: string[]
    flag: string
}

interface CurrencySelectorProps {
    currency: string;
    onCurrencyChange: (currency: string) => void;
}
export function CurrencySelector({ currency, onCurrencyChange }: CurrencySelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [currencies, setCurrencies] = React.useState<Currency[]>([])
    const [isFetching, setIsFetching] = React.useState(false)
    const [fetchingError, setFetchingError] = React.useState<string | null>(null)

    React.useEffect(() => {
        async function fetchCurrencies() {
            setIsFetching(true)
            try {
                const res = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies,flags")
                const data = await res.json()
                const map = new Map<string, Currency>()

                data.forEach((country: any) => {
                    if (country.currencies) {
                        Object.entries(country.currencies).forEach(([code, info]: any) => {
                            if (!map.has(code)) {
                                map.set(code, {
                                    code,
                                    name: info.name,
                                    symbol: info.symbol || "",
                                    countries: [country.name.common],
                                    flag: country.flags?.svg,
                                })
                            } else {
                                const existing = map.get(code)!
                                existing.countries.push(country.name.common)
                            }
                        })
                    }
                })
                setCurrencies(Array.from(map.values()))
            } catch (error) {
                console.error("Error fetching currencies:", error)
                setFetchingError(error instanceof Error ? error.message : "Failed to fetch currencies")
            }
            finally {
                setIsFetching(false)
            }
        }

        fetchCurrencies()
    }, [])

    const selected = currencies.find((c) => c.code === currency)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selected ? (
                        <span className="flex items-center gap-2">
                            <img
                                src={selected.flag}
                                alt={selected.code}
                                className="w-5 h-5 rounded-sm"
                            />
                            <span className="truncate">
                                {selected.countries[0]} ({selected.code} – {selected.name}){" "}
                                <span className="text-muted-foreground">
                                    {selected.symbol}
                                </span>
                            </span>
                        </span>
                    ) : (
                        "Select a currency..."
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search currency or country..." />
                    {fetchingError && <CommandEmpty>{fetchingError}</CommandEmpty>}
                    {isFetching && <CommandEmpty className="h-full w-full flex items-center justify-center">Loading currencies...</CommandEmpty>}
                    <CommandGroup className="overflow-y-scroll">
                        {currencies.map((c) => (
                            <CommandItem
                                key={c.code}
                                value={c.code}
                                onSelect={(currentValue) => {
                                    const code = currentValue.toUpperCase()
                                    onCurrencyChange(code === currency ? "" : code)
                                    setOpen(false)
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <img
                                        src={c.flag}
                                        alt={c.code}
                                        className="w-5 h-5 rounded-sm"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {c.countries[0]} ({c.code})
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate">
                                            {c.name} {c.symbol && `(${c.symbol})`}
                                        </span>
                                    </div>
                                </span>
                                <Check
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        currency === c.code ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                        {currency}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
