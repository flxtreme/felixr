"use client"

import { ReactNode, useId, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cln } from "@/src/utils/cln"

type WidgetAccordionProps = {
    title: string
    children: ReactNode
    defaultOpen?: boolean
    ariaLabel?: string
}

export const WidgetAccordion = ({
    title,
    children,
    defaultOpen = true,
    ariaLabel,
}: WidgetAccordionProps) => {
    const [open, setOpen] = useState(defaultOpen)
    const bodyId = useId()

    return (
        <nav aria-label={ariaLabel ?? title} className="flex flex-col px-6 py-8 w-full">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={bodyId}
                className={cln(
                    "w-full flex transition-all duration-200 cursor-pointer items-center justify-between text-left font-mono text-sm uppercase tracking-[0.18em] text-foreground/40 transition-colors hover:text-primary",
                    !open ? "mb-2" : "mb-4"
                )}
            >
                {title}
                <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={cln(
                        "transition-transform duration-200",
                        open ? "rotate-180" : ""
                    )}
                />
            </button>
            <div
                id={bodyId}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">{children}</div>
            </div>
        </nav>
    )
}