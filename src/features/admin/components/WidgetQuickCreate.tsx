import Link from "next/link"
import { WidgetAccordion } from "./WidgetAccordion"

const linkClass =
    "text-sm lowercase text-foreground/60 underline underline-offset-3 transition-colors hover:text-primary"

export const WidgetQuickCreate = () => {
    return (
        <WidgetAccordion title="Create">
            <div className="flex flex-col gap-2">
                <Link href="/admin/pages/new" className={linkClass}>page</Link>
                <Link href="/admin/posts/new" className={linkClass}>post</Link>
                <Link href="/admin/tags?create=1" className={linkClass}>tag</Link>
                <Link href="/admin/projects/new" className={linkClass}>project</Link>
                <Link href="/admin/users?create=1" className={linkClass}>user</Link>
                <div className="h-px bg-foreground/10 my-4" />
                <Link href="/admin/stack?create=1" className={linkClass}>stack</Link>
                <Link href="/admin/certifications?create=1" className={linkClass}>certification</Link>
                <Link href="/admin/experience?create=1" className={linkClass}>experience</Link>
                <Link href="/admin/gigs?create=1" className={linkClass}>gig</Link>
                <div className="h-px bg-foreground/10 my-4" />
                <Link href="/admin/shop?create=1" className={linkClass}>shop item</Link>
                <Link href="/admin/uploads?create=1" className={linkClass}>upload</Link>
            </div>
        </WidgetAccordion>
    )
}