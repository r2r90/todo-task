import * as React from "react"

export interface Task {
    id: string
    shortDesc: string
    longDesc?: string
    createdAt: string  // ISO string
    dueDate: string    // ISO string
    completed: boolean
}

const DUMMY_TASKS: Task[] = [
    {
        id: "1",
        shortDesc: "Buy groceries",
        longDesc: "Milk, eggs, bread, and cheese",
        createdAt: "2025-07-01T08:30:00Z",
        dueDate:   "2025-07-05T18:00:00Z",
        completed: false,
    },
    {
        id: "2",
        shortDesc: "Finish report",
        longDesc: "Annual financial report for Q2",
        createdAt: "2025-06-28T09:15:00Z",
        dueDate:   "2025-07-03T17:00:00Z",
        completed: true,
    },
    {
        id: "3",
        shortDesc: "Walk the dog",
        longDesc: "30-minute morning walk in the park",
        createdAt: "2025-07-04T07:30:00Z",
        dueDate:   "2025-07-04T08:00:00Z",
        completed: true,
    },
    {
        id: "4",
        shortDesc: "Call Alice",
        longDesc: "Discuss the project timeline",
        createdAt: "2025-07-02T14:45:00Z",
        dueDate:   "2025-07-06T11:00:00Z",
        completed: false,
    },
    {
        id: "5",
        shortDesc: "Plan weekend trip",
        longDesc: "Check hotels and flights",
        createdAt: "2025-07-01T12:00:00Z",
        dueDate:   "2025-07-10T00:00:00Z",
        completed: false,
    },
    {
        id: "6",
        shortDesc: "Read book",
        longDesc: "Start reading 'Clean Code'",
        createdAt: "2025-06-30T16:20:00Z",
        dueDate:   "2025-07-07T20:00:00Z",
        completed: false,
    },
    {
        id: "7",
        shortDesc: "Email HR",
        longDesc: "Ask about PTO balance",
        createdAt: "2025-07-01T10:00:00Z",
        dueDate:   "2025-07-03T12:00:00Z",
        completed: true,
    },
    {
        id: "8",
        shortDesc: "Gym session",
        longDesc: "Leg day workout",
        createdAt: "2025-07-04T18:00:00Z",
        dueDate:   "2025-07-04T19:30:00Z",
        completed: false,
    },
    {
        id: "9",
        shortDesc: "Backup laptop",
        longDesc: "Full system backup to external drive",
        createdAt: "2025-07-02T22:15:00Z",
        dueDate:   "2025-07-02T23:00:00Z",
        completed: true,
    },
    {
        id: "10",
        shortDesc: "Update resume",
        longDesc: "Add latest projects and skills",
        createdAt: "2025-07-03T11:00:00Z",
        dueDate:   "2025-07-08T17:00:00Z",
        completed: false,
    },
]

interface TasksContextValue {
    tasks: Task[]
    loadTasks: (listId: string) => void
    createTask: (listId: string, data: Omit<Task, "id" | "createdAt" | "completed">) => void
    toggleComplete: (taskId: string) => void
    editTask: (taskId: string, updates: Partial<Task>) => void
    deleteTask: (taskId: string) => void
    addSubtask: (taskId: string) => void
}

const TasksContext = React.createContext<TasksContextValue | undefined>(undefined)

export const TasksProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [tasks, setTasks] = React.useState<Task[]>([])

    const loadTasks = React.useCallback((listId: string) => {
        // TO: replace with real fetch
        console.log("Loading tasks for list", listId)
        setTasks(DUMMY_TASKS)
    }, [])

    const createTask = React.useCallback((listId: string, data: Omit<Task, "id" | "createdAt" | "completed">) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            createdAt: new Date().toISOString(),
            completed: false,
            ...data,
        }
        setTasks((prev) => [newTask, ...prev])
    }, [])

    const toggleComplete = React.useCallback((taskId: string) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
            )
        )
    }, [])

    const editTask = React.useCallback((taskId: string, updates: Partial<Task>) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
        )
    }, [])

    const deleteTask = React.useCallback((taskId: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
    }, [])

    const addSubtask = React.useCallback((taskId: string) => {
        console.log("Add subtask to", taskId)
    }, [])

    return (
        <TasksContext.Provider
            value={{
                tasks,
                loadTasks,
                createTask,
                toggleComplete,
                editTask,
                deleteTask,
                addSubtask,
            }}
        >
            {children}
        </TasksContext.Provider>
    )
}

export function useTasks(): TasksContextValue {
    const ctx = React.useContext(TasksContext)
    if (!ctx) {
        throw new Error("useTasks must be used within a TasksProvider")
    }
    return ctx
}
