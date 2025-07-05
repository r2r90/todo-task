import * as React from "react"
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
                            <SheetTitle>Détails de la tâche</SheetTitle>
                            <SheetDescription>
                                Ici vous pouvez voir et modifier les détails de la tâche.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-4 px-4">
                            <p><strong>Description courte :</strong> {task.shortDesc}</p>
                            {task.longDesc && (
                                <p><strong>Description longue :</strong> {task.longDesc}</p>
                            )}
                            <p><strong>Date de création :</strong> {new Date(task.createdAt).toLocaleString()}</p>
                            <p><strong>Date d’échéance :</strong> {new Date(task.dueDate).toLocaleString()}</p>
                            <p><strong>Terminée :</strong> {task.completed ? "Oui" : "Non"}</p>
                        </div>

                        <SheetFooter>
                            {/* Confirmation avant suppression */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        Supprimer la tâche
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Supprimer cette tâche ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action est irréversible et retirera définitivement la tâche.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => onDelete(task.id)}
                                        >
                                            Confirmer
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            {/* Bouton pour fermer le sheet */}
                            <SheetClose asChild>
                                <Button variant="outline">Fermer</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    )
}
