import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { PiDotsSixVertical } from "react-icons/pi"

interface TodoListItemMenuProps {
    listId: string
    onEdit?: (id: string) => void
    onDelete: (id: string) => void
}

export function TodoListItemMenu({
                                     listId,
                                     onEdit,
                                     onDelete,
                                 }: TodoListItemMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-muted/10 focus:outline-none focus:bg-transparent "
                >
                    <PiDotsSixVertical />
                    <span className="sr-only">Open actions</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32">
                {onEdit && (
                    <DropdownMenuItem onSelect={() => onEdit(listId)}>
                        Edit
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => onDelete(listId)}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
