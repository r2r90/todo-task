import * as React from "react"

export interface TaskList {
    id: string
    name: string
}

interface ListsContextValue {
    lists: TaskList[]
    activeListId: string | null
    createList: (name: string) => void
    selectList: (id: string) => void
    deleteList: (id: string) => void
}

const ListsContext = React.createContext<ListsContextValue | undefined>(undefined)

export const ListsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [lists, setLists] = React.useState<TaskList[]>([])
    const [activeListId, setActiveListId] = React.useState<string | null>(null)

    const createList = React.useCallback((name: string) => {
        const newList = { id: `list-${Date.now()}`, name }
        setLists(prev => [...prev, newList])
        setActiveListId(newList.id)
    }, [])

    const selectList = React.useCallback((id: string) => {
        setActiveListId(id)
    }, [])

    const deleteList = React.useCallback((id: string) => {
        setLists(prev => prev.filter(l => l.id !== id))
        setActiveListId(prev => (prev === id ? null : prev))
    }, [])

    return (
        <ListsContext.Provider value={{ lists, activeListId, createList, selectList, deleteList }}>
            {children}
        </ListsContext.Provider>
    )
}

export function useLists(): ListsContextValue {
    const ctx = React.useContext(ListsContext)
    if (!ctx) throw new Error("useLists must be used inside a ListsProvider")
    return ctx
}