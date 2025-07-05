import * as React from "react"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {Separator} from "@/components/ui/separator"
import {PiDotsSixVertical} from "react-icons/pi"
import {TodoListItemMenu} from "./TodoListItemMenu"

export interface TaskList {
    id: string
    name: string
}

interface TodoListItemProps {
    list: TaskList
    isActive: boolean
    onSelect: (id: string) => void
    onDelete: (id: string) => void
    showSeparator: boolean
}

export function TodoListItem({
                                 list,
                                 isActive,
                                 onSelect,
                                 onDelete,
                                 showSeparator,
                             }: TodoListItemProps) {
    return (
        <React.Fragment>
            <div
                onClick={() => onSelect(list.id)}
                className={`
          w-full h-10 flex items-center justify-between
          px-3 text-sm truncate
          border rounded-sm cursor-pointer
          ${isActive
                    ? "border-primary"
                    : "border-gray-200 hover:bg-muted/50"}
        `}
            >
                <span>{list.name}</span>

                <TodoListItemMenu
                    listId={list.id}
                    onDelete={onDelete}
                    onEdit={() => console.log("Edit", list.id)}
                />
            </div>

            {showSeparator && <Separator className="my-1"/>}
        </React.Fragment>
    )
}
