import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginFormSchema } from '@/shared/validation/schemas';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import LoginFormFields from "@/components/auth/login/LoginFormFiels";

type LoginValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(values: LoginValues) {
        try {
            await login(values.email, values.password);
            toast.success('Login successful!');
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            console.error('Login error', err);
            toast.error(err.response?.data?.message || 'Invalid email or password.');
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <LoginFormFields form={form} />
        </form>
    );
}
