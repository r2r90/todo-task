import {ScrollArea} from "@/components/ui/scroll-area.tsx"
import {TodoListItem, type TaskList} from "./TodoListItem.tsx"

interface TodoListTableProps {
    lists: TaskList[]
    activeListId: string | null
    onSelect: (id: string) => void
    onDelete: (id: string) => void
}

export function TodoListTable({
                                  lists,
                                  activeListId,
                                  onSelect,
                                  onDelete,
                              }: TodoListTableProps) {
    return (
        <ScrollArea className="h-full overflow-auto px-2">
            <div className="p-4">
                <h4 className="mb-4 text-sm font-medium">My Tasks Lists</h4>

                {lists.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No lists yet.</p>
                ) : (
                    lists.map((list, idx) => (
                        <TodoListItem
                            key={list.id}
                            list={list}
                            isActive={list.id === activeListId}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            showSeparator={idx < lists.length - 1}
                        />
                    ))
                )}
            </div>
        </ScrollArea>
    )
}
