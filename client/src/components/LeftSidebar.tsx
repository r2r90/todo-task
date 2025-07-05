import * as React from "react"
import {Sidebar,} from "@/components/ui/sidebar"
import AddList from "@/components/AddList.tsx";
import {Separator} from "@radix-ui/react-separator";

// This is sample data.


export function LeftSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <AddList />
            <Separator className="my-4" />
        </Sidebar>
    )
}
