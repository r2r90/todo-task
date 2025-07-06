import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { registerFormSchema } from "@/shared/validation/schemas";
import RegisterFormFields from "./RegisterFormFields";

export type RegisterValues = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
    const navigate = useNavigate();
    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: RegisterValues) => {
        try {
            await api.post("/auth/register", {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
            });
            toast.success("Registration successful! Please log in.");
            navigate("/login", { replace: true });
        } catch (err: any) {
            if (err.response?.status === 409) {
                toast.error("Email is already in use.");
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Registration failed. Please try again.");
            }
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <RegisterFormFields form={form} />
        </form>
    );
}
