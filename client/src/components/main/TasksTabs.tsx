import * as React from "react"
import { useLists } from "@/hooks/ListsContext"
import { useTasks } from "@/hooks/TasksContext"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import TodoTable from "@/components/main/TodoTable"

export function TasksTabs() {
    const { activeListId } = useLists()
    const { tasks, loadTasks, toggleComplete, deleteTask, editTask, addSubtask } =
        useTasks()

    // Reload tasks whenever the selected list changes
    React.useEffect(() => {
        if (activeListId) {
            loadTasks(activeListId)
        }
    }, [activeListId, loadTasks])

    // Separate active and completed tasks
    const activeTasks = tasks.filter((t) => !t.completed)
    const completedTasks = tasks.filter((t) => t.completed)

    // Adapt our Task shape to what TodoTable expects
    const mapForTable = (list: typeof tasks) =>
        list.map((t) => ({
            id: t.id,
            shortDesc: t.shortDescription,
            longDesc: t.longDescription,
            createdAt: t.createdAt,
            dueDate: t.dueDate,
            completed: t.completed,
        }))

    return (
        <Tabs defaultValue="active" className="flex flex-col h-full">
            <TabsList>
                <TabsTrigger value="active">
                    To Do ({activeTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                    Completed ({completedTasks.length})
                </TabsTrigger>
            </TabsList>

            {/* Active tasks view */}
            <TabsContent value="active" className="flex-1 overflow-auto p-4">
                {activeTasks.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                        No tasks in this list yet.
                        <br />
                        Start by adding your first task below.
                    </p>
                ) : (
                    <TodoTable
                        items={mapForTable(activeTasks)}
                        onToggle={(id) => toggleComplete(id)}
                        onDelete={(id) => deleteTask(id)}
                        onAddSubtask={(id) => addSubtask(id)}
                    />
                )}
            </TabsContent>

            {/* Completed tasks view */}
            <TabsContent value="completed" className="flex-1 overflow-auto p-4">
                {completedTasks.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                        No completed tasks yet.
                    </p>
                ) : (
                    <TodoTable
                        items={mapForTable(completedTasks)}
                        onToggle={(id) => toggleComplete(id)}
                        onDelete={(id) => deleteTask(id)}
                        onAddSubtask={(id) => addSubtask(id)}
                    />
                )}
            </TabsContent>
        </Tabs>
    )
}
