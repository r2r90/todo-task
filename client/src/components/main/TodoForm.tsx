import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatetimePicker } from "@/components/ui/DateTimePicker"

import { useTasks } from "@/hooks/TasksContext"
import { useLists } from "@/hooks/ListsContext"

// Zod schema
const formSchema = z.object({
    shortDesc: z.string().min(1, "Short description is required"),
    longDesc: z.string().optional(),
    dueDate: z.coerce.date({ invalid_type_error: "Invalid due date" }),
})

export type TodoFormValues = z.infer<typeof formSchema>

export default function TodoForm() {
    const { activeListId } = useLists()
    const { createTask, loadTasks } = useTasks()

    const form = useForm<TodoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shortDesc: "",
            longDesc: "",
            dueDate: new Date(),
        },
    })

    // onSubmit now matches server DTO
    async function onSubmit(values: TodoFormValues) {
        if (!activeListId) {
            toast.error("Please select a list first.")
            return
        }

        try {
            await createTask(activeListId, {
                shortDescription: values.shortDesc,
                longDescription: values.longDesc,
                dueDate: values.dueDate.toISOString(),
            })

            // refresh list
            await loadTasks(activeListId)

            toast.success("Task added!")
            form.reset()
        } catch (err) {
            toast.error("Could not add task. Please try again.")
        }
    }

    return (
        <Form {...form}>
            <div className="px-4 py-6">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 max-w-3xl mx-auto"
                >
                    {/* Short Description */}
                    <FormField
                        control={form.control}
                        name="shortDesc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Description *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Task title" {...field} />
                                </FormControl>
                                <FormDescription>Enter a brief title.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Long Description */}
                    <FormField
                        control={form.control}
                        name="longDesc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Long Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Details (optional)" rows={4} {...field} />
                                </FormControl>
                                <FormDescription>Any extra details.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Due Date */}
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Due Date *</FormLabel>
                                <FormControl>
                                    <DatetimePicker
                                        {...field}
                                        format={[
                                            ["years", "months", "days"],
                                            ["hours", "minutes", "am/pm"],
                                        ]}
                                    />
                                </FormControl>
                                <FormDescription>Select deadline.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Add Task</Button>
                </form>
            </div>
        </Form>
    )
}
