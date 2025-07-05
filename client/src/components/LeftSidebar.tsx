import * as React from "react"
import {Sidebar,} from "@/components/ui/sidebar"
import AddList from "@/components/AddList.tsx";
import {Separator} from "@radix-ui/react-separator";
import {TodoListTable} from "@/components/TodoListTable.tsx";
import {useLists} from "@/hooks/ListsContext.tsx";


export function LeftSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const { lists, activeListId, createList, selectList, deleteList } = useLists()


    return (
        <Sidebar {...props}>
            <AddList onCreate={createList}/>
            <Separator className="my-4"/>
            <div className="flex-1 overflow-auto">
                <TodoListTable
                    lists={lists}
                    activeListId={activeListId}
                    onSelect={selectList}
                    onDelete={deleteList}
                />
            </div>
        </Sidebar>
    )
}
