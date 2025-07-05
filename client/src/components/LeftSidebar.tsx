import * as React from "react"
import {Sidebar,} from "@/components/ui/sidebar"
import AddList from "@/components/AddList.tsx";
import {Separator} from "@radix-ui/react-separator";
import {TodoListTable} from "@/components/TodoListTable.tsx";


export function LeftSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    // — Fake initial lists —
    const initialLists: TaskList[] = [
        {id: "list-1", name: "Work"},
        {id: "list-2", name: "Personal"},
        {id: "list-3", name: "Shopping"},
    ]

    const [lists, setLists] = React.useState<TaskList[]>(initialLists)
    const [activeListId, setActiveListId] = React.useState<string | null>(null)

    // Add new list
    const handleCreate = (name: string) => {
        const newList = {id: `list-${Date.now()}`, name}
        setLists((prev) => [...prev, newList])
        setActiveListId(newList.id)
    }

    // Select a list
    const handleSelect = (id: string) => {
        setActiveListId(id)
    }

    // Delete a list
    const handleDelete = (id: string) => {
        if (confirm("Deleting this list will remove all its tasks. Continue?")) {
            setLists((prev) => prev.filter((l) => l.id !== id))
            if (activeListId === id) setActiveListId(null)
        }
    }

    return (
        <Sidebar {...props}>
            <AddList/>
            <Separator className="my-4"/>
            <div className="flex-1 overflow-auto">
                <TodoListTable
                    lists={lists}
                    activeListId={activeListId}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                />
            </div>
        </Sidebar>
    )
}
