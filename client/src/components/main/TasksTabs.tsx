import * as React from "react"
import {useLists} from "@/hooks/ListsContext"
import {useTasks} from "@/hooks/TasksContext"
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs"
import TodoTable from "@/components/main/TodoTable.tsx";

export function TasksTabs() {
    const {activeListId} = useLists()
    const {tasks, loadTasks, toggleComplete, deleteTask, editTask, addSubtask} = useTasks()

    const activeTasks = tasks.filter((t) => !t.completed)
    const completedTasks = tasks.filter((t) => t.completed)

    React.useEffect(() => {
        if (activeListId) loadTasks(activeListId)
    }, [activeListId, loadTasks])

    return (
        <Tabs defaultValue="active" className="flex flex-col h-full">
            <TabsList>
                <TabsTrigger value="active">À faire ({activeTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">Terminées ({completedTasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="flex-1 overflow-auto p-4">
                {activeTasks.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                        Vous n’avez aucune tâche dans cette liste.<br/>
                        Commencez par ajouter votre première tâche ci-dessous.
                    </p>
                ) : (
                    <TodoTable
                        items={activeTasks}
                        onToggle={(id) => toggleComplete(id)}
                        onEdit={(id) => editTask(id, {})}
                        onDelete={(id) => deleteTask(id)}
                        onAddSubtask={(id) => addSubtask(id)}
                    />
                )}
            </TabsContent>

            <TabsContent value="completed" className="flex-1 overflow-auto p-4">
                {completedTasks.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                        Aucune tâche terminée pour le moment.
                    </p>
                ) : (
                    <TodoTable
                        items={completedTasks}
                        onToggle={(id) => toggleComplete(id)}
                        onEdit={(id) => editTask(id, {})}
                        onDelete={(id) => deleteTask(id)}
                        onAddSubtask={(id) => addSubtask(id)}
                    />
                )}
            </TabsContent>
        </Tabs>
    )
}
