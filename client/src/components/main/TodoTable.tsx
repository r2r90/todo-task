import Todo from "./Todo"
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export interface TodoData {
    id: string
    shortDesc: string
    longDesc?: string
    createdAt: string
    dueDate: string
    completed: boolean
}

interface TodoTableProps {
    items: TodoData[]
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}

export default function TodoTable({ items, onToggle, onDelete }: TodoTableProps) {
    return (
        <div className="flex flex-col space-y-2 p-4">
            {items.map((task) => (
                <Sheet key={task.id}>
                    <SheetTrigger asChild>
                        <div>
                            <Todo
                                {...task}
                                onToggleComplete={() => onToggle(task.id)}
                            />
                        </div>
                    </SheetTrigger>

                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Task Details</SheetTitle>
                            <SheetDescription>
                                Here you can view and edit the details of the task.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-4 px-4">
                            <p><strong>Short Description:</strong> {task.shortDesc}</p>
                            {task.longDesc && (
                                <p><strong>Long Description:</strong> {task.longDesc}</p>
                            )}
                            <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
                            <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}</p>
                            <p><strong>Completed:</strong> {task.completed ? "Yes" : "No"}</p>
                        </div>

                        <SheetFooter>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        Delete Task
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone and will permanently remove the task.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => onDelete(task.id)}
                                        >
                                            Confirm
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    )
}
