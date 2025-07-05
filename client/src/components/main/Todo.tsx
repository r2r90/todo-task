import {Button} from "@/components/ui/button.tsx";

export interface TodoProps {
    id: string
    shortDesc: string
    longDesc?: string
    createdAt: string
    dueDate: string
    completed: boolean
    onToggleComplete: () => void
    onEdit: () => void
    onDelete: () => void
    onAdd: () => void
}

export default function Todo({shortDesc, onToggleComplete}: TodoProps) {
    return (
        <div className="flex items-center gap-3 border rounded-xl px-3 py-2 w-full bg-white">
            <div className="flex-1 space-y-1">
                <div className="text-sm font-medium">
                    {shortDesc}
                </div>
            </div>
            <Button variant="outline" onClick={onToggleComplete}>Done</Button>
        </div>
    )
}
