import React from "react"
import {Checkbox} from "@/components/ui/checkbox.tsx";

export interface TodoProps {
    id: string
    shortDesc: string
    longDesc?: string
    createdAt: string   // ISO date
    dueDate: string     // ISO date
    completed: boolean
    onToggleComplete: () => void
    onEdit: () => void
    onDelete: () => void
    onAdd: () => void
}

export default function Todo({
                                 shortDesc,
                                 longDesc,
                                 createdAt,
                                 dueDate,
                                 completed,
                                 onToggleComplete,
                                 onEdit,
                                 onDelete,
                                 onAdd,
                             }: TodoProps) {
    return (
        <div
            className="flex items-center gap-3 border rounded-xl px-3 py-2 w-full
                bg-white"
        >

            <div className="flex-1 space-y-1">
                <div className="text-sm font-medium">
                    {shortDesc}
                </div>


            </div>
            <Checkbox
                id="toggle"
                checked={completed}
                onCheckedChange={onToggleComplete}
            />
        </div>
    )
}
