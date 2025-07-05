import * as React from "react"
import { Button } from "@/components/ui/button.tsx"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog.tsx"
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
    const [confirmOpen, setConfirmOpen] = React.useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:bg-muted/10 focus:outline-none"
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
                    <DropdownMenuItem onSelect={() => setConfirmOpen(true)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Controlled AlertDialog: no Trigger element */}
            <AlertDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this list?</AlertDialogTitle>
                        <AlertDialogDescription>
                            All tasks in “{listId}” will be removed. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(listId)
                                setConfirmOpen(false)
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
