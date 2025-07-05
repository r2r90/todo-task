// src/hooks/TasksContext.tsx

import * as React from "react"
import { api } from "@/lib/api"
import { useAuth } from "./use-auth.hook"

export interface Task {
    id: string
    shortDescription: string
    longDescription?: string
    createdAt: string
    dueDate: string
    completed: boolean
}

interface TasksContextValue {
    tasks: Task[]
    loadTasks: (listId: string) => Promise<void>
    createTask: (
        listId: string,
        data: {
            shortDescription: string
            longDescription?: string
            dueDate: string
        }
    ) => Promise<void>
    toggleComplete: (taskId: string) => Promise<void>
    editTask: (taskId: string, updates: Partial<Task>) => Promise<void>
    deleteTask: (taskId: string) => Promise<void>
}

const TasksContext = React.createContext<TasksContextValue | undefined>(
    undefined
)

export const TasksProvider: React.FC<React.PropsWithChildren<{}>> = ({
                                                                         children,
                                                                     }) => {
    const { accessToken } = useAuth()
    const [tasks, setTasks] = React.useState<Task[]>([])

    // Load all tasks
    const loadTasks = React.useCallback(
        async (listId: string) => {
            if (!accessToken) return
            try {
                const res = await api.get<Task[]>(
                    `/todo/list/${listId}/todos`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                )
                setTasks(res.data)
            } catch (err) {
                console.error("Failed to load tasks", err)
            }
        },
        [accessToken]
    )

    // Create a new task
    const createTask = React.useCallback(
        async (
            listId: string,
            data: {
                shortDescription: string
                longDescription?: string
                dueDate: string
            }
        ) => {
            if (!accessToken) return
            try {
                const res = await api.post<Task>(
                    `/todo/${listId}/todo`,
                    {
                        shortDescription: data.shortDescription,
                        longDescription: data.longDescription,
                        dueDate: data.dueDate,
                    },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                )
                setTasks((prev) => [res.data, ...prev])
            } catch (err: any) {
                console.error("Failed to create task", err.response?.data || err)
            }
        },
        [accessToken]
    )

    // Toggle completion
    const toggleComplete = React.useCallback(
        async (taskId: string) => {
            if (!accessToken) return
            try {
                const res = await api.patch<Task>(
                    `/todo/${taskId}`,
                    {},
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                )
                setTasks((prev) =>
                    prev.map((t) => (t.id === taskId ? res.data : t))
                )
            } catch (err) {
                console.error("Failed to toggle completion", err)
            }
        },
        [accessToken]
    )

    // Edit a task
    const editTask = React.useCallback(
        async (taskId: string, updates: Partial<Task>) => {
            if (!accessToken) return
            try {
                const res = await api.patch<Task>(
                    `/todo/${taskId}`,
                    updates,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                )
                setTasks((prev) =>
                    prev.map((t) => (t.id === taskId ? res.data : t))
                )
            } catch (err) {
                console.error("Failed to edit task", err)
            }
        },
        [accessToken]
    )

    // Delete a task
    const deleteTask = React.useCallback(
        async (taskId: string) => {
            if (!accessToken) return
            try {
                await api.delete(`/todo/${taskId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                setTasks((prev) => prev.filter((t) => t.id !== taskId))
            } catch (err) {
                console.error("Failed to delete task", err)
            }
        },
        [accessToken]
    )

    return (
        <TasksContext.Provider
            value={{
                tasks,
                loadTasks,
                createTask,
                toggleComplete,
                editTask,
                deleteTask,
            }}
        >
            {children}
        </TasksContext.Provider>
    )
}

export function useTasks(): TasksContextValue {
    const ctx = React.useContext(TasksContext)
    if (!ctx) throw new Error("useTasks must be used within a TasksProvider")
    return ctx
}
