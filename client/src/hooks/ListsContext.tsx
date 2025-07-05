import * as React from "react"
import {api} from "@/lib/api"
import {useAuth} from "@/hooks/use-auth.hook.ts";
import {toast} from "sonner";       // your axios instance

export interface TaskList {
    id: string
    title: string
}

interface ListsContextValue {
    lists: TaskList[]
    activeListId: string | null
    createList: (name: string) => Promise<void>
    selectList: (id: string) => void
    deleteList: (id: string) => Promise<void>
}

const ListsContext = React.createContext<ListsContextValue | undefined>(
    undefined,
)

export const ListsProvider: React.FC<React.PropsWithChildren<{}>> = ({
                                                                         children,
                                                                     }) => {
    const {accessToken} = useAuth()
    const [lists, setLists] = React.useState<TaskList[]>([])
    const [activeListId, setActiveListId] = React.useState<string | null>(null)


    // Fetch existing lists on mount
    React.useEffect(() => {
        if (!accessToken) return
        (async () => {
            try {
                const res = await api.get<TaskList[]>("/todo/list", {
                    headers: {Authorization: `Bearer ${accessToken}`},
                })
                setLists(res.data)
                if (res.data.length) setActiveListId(res.data[0].id)
            } catch (err) {
                console.error("Failed to fetch lists", err)
            }
        })()
    }, [accessToken])

    // Create
    const createList = React.useCallback(
        async (name: string) => {
            if (!accessToken) throw new Error("Not authenticated")
            try {
                const res = await api.post<TaskList>(
                    "/todo/list",
                    {title: name},
                    {headers: {Authorization: `Bearer ${accessToken}`}},
                )
                setLists((prev) => [...prev, res.data])
                setActiveListId(res.data.id)
            } catch (err: any) {
                if (err.response?.status === 409) {
                    alert("A list with that name already exists.")
                } else {
                    console.error("Failed to create list", err)
                }
            }
        },
        [accessToken],
    )

    // Select
    const selectList = React.useCallback((id: string) => {
        setActiveListId(id)
    }, [])

    // Delete
    const deleteList = React.useCallback(
        async (id: string) => {
            if (!accessToken) throw new Error("Not authenticated")
            try {
                await api.delete(`/todo/list/${id}`, {
                    headers: {Authorization: `Bearer ${accessToken}`},
                })
                setLists((prev) => prev.filter((l) => l.id !== id))
                toast.success('List Successfully deleted.')
                setActiveListId((prev) => (prev === id ? null : prev))
            } catch (err) {
                console.error("Failed to delete list", err)
            }
        },
        [accessToken],
    )

    return (
        <ListsContext.Provider
            value={{
                lists,
                activeListId,
                createList,
                selectList,
                deleteList,
            }}
        >
            {children}
        </ListsContext.Provider>
    )
}

export function useLists(): ListsContextValue {
    const ctx = React.useContext(ListsContext)
    if (!ctx) throw new Error("useLists must be used inside a ListsProvider")
    return ctx
}
