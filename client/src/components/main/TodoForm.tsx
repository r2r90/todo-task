import {toast} from "sonner"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {DatetimePicker} from "@/components/ui/DateTimePicker"

// 1. Новая схема валидации
const formSchema = z.object({
    shortDesc: z.string().min(1, "La description courte est requise"),
    longDesc: z.string().optional(),
    dueDate: z.coerce.date({
        invalid_type_error: "Date d’échéance invalide",
    }),
})

export type TodoFormValues = z.infer<typeof formSchema>

export default function TodoForm() {
    const form = useForm<TodoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shortDesc: "",
            longDesc: "",
            dueDate: new Date(),
        },
    })

    function onSubmit(values: TodoFormValues) {
        try {
            console.log(values)
            toast.success("Tâche ajoutée !", {
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(values, null, 2)}
            </code>
          </pre>
                ),
            })
        } catch (error) {
            console.error("Form submission error", error)
            toast.error("Échec de la soumission. Réessayez.")
        }
    }

    return (
        <Form {...form}>
            <div className="px-4 py-6">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 max-w-3xl mx-auto"
                >
                    {/* Description courte */}
                    <FormField
                        control={form.control}
                        name="shortDesc"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description courte *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Titre de la tâche"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Entrez une description brève de la tâche.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Description longue */}
                    <FormField
                        control={form.control}
                        name="longDesc"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description longue</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Détails (optionnel)"
                                        rows={4}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Fournissez plus de détails si nécessaire.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Date d’échéance */}
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date d’échéance *</FormLabel>
                                <FormControl>
                                    <DatetimePicker
                                        {...field}
                                        format={[
                                            ["years", "months", "days"],
                                            ["hours", "minutes", "am/pm"],
                                        ]}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Sélectionnez la date et l’heure limite.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Ajouter la tâche</Button>
                </form>
            </div>
        </Form>
    )
}
