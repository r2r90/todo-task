import {Separator} from "@/components/ui/separator"
import type {TaskList} from "@/hooks/ListsContext"
import {DeleteListButton} from "@/components/left-sidebar/DeleteListButton";

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
        <>
            <div
                onClick={() => {
                    if (isActive) {
                        onSelect("");
                    } else {
                        onSelect(list.id);
                    }
                }}
                className={`
                    flex items-center gap-3
                    ${isActive ? "border-primary" : "border-gray-200 hover:bg-muted/50"}
                    border rounded-md px-3 py-1 w-full cursor-pointer
                `}
            >
                <div className="w-full text-sm truncate">{list.title}</div>
                <DeleteListButton listTitle={list.title} listId={list.id} onDelete={onDelete}/>
            </div>
            {showSeparator && <Separator className="my-1"/>}
        </>
    )
}
