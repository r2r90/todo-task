import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { loginFormSchema } from '@/shared/validation/schemas';

type LoginValues = z.infer<typeof loginFormSchema>;

interface LoginFormFieldsProps {
    form: UseFormReturn<LoginValues>;
}

export default function LoginFormFields({ form }: LoginFormFieldsProps) {
    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
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
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
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
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" className="w-full">
                Sign In
            </Button>
        </Form>
    );
}
