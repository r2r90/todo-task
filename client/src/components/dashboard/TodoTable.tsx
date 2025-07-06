import Todo from "./Todo"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import {ConfirmDialog} from "@/components/ui/ConfirmDialog";

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
                            <ConfirmDialog
                                triggerLabel={
                                    <Button variant="destructive">Delete Task</Button>
                                }
                                description="This will permanently delete the task. Are you sure?"
                                confirmLabel="Delete"
                                onConfirm={() => onDelete(task.id)}
                            />
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
