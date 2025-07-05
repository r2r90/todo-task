import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {LeftSidebar} from "@/components/LeftSidebar.tsx";

export default function Page() {
    return (
        <SidebarProvider>
            <LeftSidebar />
            <SidebarInset>
                <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />

                </header>
            </SidebarInset>
        </SidebarProvider>
    )
}
