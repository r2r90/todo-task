import {ReactNode} from "react";
import {Card, CardContent} from "@/components/ui/card.tsx";
import { Button } from "./ui/button";
import {Trash2} from "lucide-react";

const lists = [
    {
        id: "list-1",               // unique identifier for the list
        title: "Work",               // list name
    },
    {
        id: "list-2",
        title: "Personal",
    },
]

function ScrollArea(props: { className: string, children: ReactNode }) {
    return null;
}

export function TodoList() {
    return (
        <ScrollArea className="flex-1 px-2">
            {lists.map((list) => (
                <Card
                    key={list.id}
                    onClick={() => onSelect(list.id)}
                    className={`
              mb-2 cursor-pointer
              ${list.id === activeListId ? "border-2 border-primary" : ""}
            `}
                >
                    <CardContent className="flex items-center justify-between p-3">
                        <span>{list.name}</span>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation()
                                if (confirm("Deleting this list will remove all its tasks. Continue?")) {
                                    onDelete(list.id)
                                }
                            }}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </CardContent>
                </Card>
            ))}
            {lists.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">
                    You haven’t created any lists yet.
                </p>
            )}
        </ScrollArea>
    )
}
