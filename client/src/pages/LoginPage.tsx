import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {toast} from 'sonner'
import {useNavigate, Link} from 'react-router-dom'
import {loginFormSchema} from '@/shared/validation/schemas'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {PasswordInput} from '@/components/ui/password-input'
import {useAuth} from "@/hooks/use-auth.hook.ts";

type LoginValues = z.infer<typeof loginFormSchema>

export default function LoginPage() {
    const navigate = useNavigate()
    const {login} = useAuth()
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {email: '', password: ''},
    })

    async function onSubmit(values: LoginValues) {
        try {
            await login(values.email, values.password)
            toast.success('Login successful!')
            navigate('/dashboard', {replace: true})
        } catch (err: any) {
            console.error('Login error', err)
            toast.error(err.response?.data?.message || 'Invalid email or password.')
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="email">Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                id="password"
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Sign In
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
