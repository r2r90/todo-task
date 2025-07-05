import {useState} from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "./ui/dialog"
import {Button} from "./ui/button"
import {Input} from "./ui/input"
import {Label} from "./ui/label"

interface AddListProps {
    onCreate: (title: string) => void
}

export default function AddList({onCreate}: AddListProps) {
    const [open, setOpen] = useState(false)
    const [newListTitle, setNewListTitle] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const title = newListTitle.trim()
        if (!title) return
        onCreate(title)
        setNewListTitle("")
        setOpen(false)
    }

    return (
        <aside className="w-64 border-r p-4 flex flex-col">
            <Dialog open={open} onOpenChange={setOpen}>
                {/* Trigger button */}
                <DialogTrigger asChild>
                    <Button variant="outline">Add List</Button>
                </DialogTrigger>

                {/* This portals to <body> and is centered */}
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New List</DialogTitle>
                        <DialogDescription>
                            Give your new task list a unique name.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-1">
                            <Label htmlFor="new-list-name">List Name</Label>
                            <Input
                                id="new-list-name"
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                placeholder="e.g. Work, Groceries…"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </aside>
    )
}
