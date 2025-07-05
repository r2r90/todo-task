import * as React from "react"
import {Separator} from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type {TaskList} from "@/hooks/ListsContext"

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
          flex items-center gap-3
          ${isActive ? "border-primary" : "border-gray-200 hover:bg-muted/50"}
          border rounded-md px-3 py-1 w-full cursor-pointer
        `}
            >
                <div className="w-full text-sm truncate">{list.title}</div>

                {/* AlertDialog wraps the delete button */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1
                                        focus:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* trash icon */}
                            <svg
                                stroke="currentColor"
                                fill="none"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                        </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this list?</AlertDialogTitle>
                            <AlertDialogDescription>
                                All tasks from “{list.title}” will also be deleted. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    onDelete(list.id)
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {showSeparator && <Separator className="my-1"/>}
        </React.Fragment>
    )
}
