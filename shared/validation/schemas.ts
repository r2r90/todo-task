import {z} from "zod";

export const passwordSchema = z
    .string({
        required_error: "Password can not be empty.",
    })
    .regex(/^.{8,20}$/, {
        message: "Minimum 8 and maximum 20 characters.",
    })
    .regex(/(?=.*[A-Z])/, {
        message: "At least one uppercase character.",
    })
    .regex(/(?=.*[a-z])/, {
        message: "At least one lowercase character.",
    })
    .regex(/(?=.*\d)/, {
        message: "At least one digit.",
    })
    .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
        message: "At least one special character.",
    })

export const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export const registerFormSchema = z
    .object({
        firstName: z
            .string()
            .min(2, { message: "First name must be at least 2 characters long." })
            .max(30, { message: "First name must be at most 30 characters long." }),
        lastName: z
            .string()
            .min(2, { message: "Last name must be at least 2 characters long." })
            .max(30, { message: "Last name must be at most 30 characters long." }),
        email: z
            .string()
            .email({ message: "Please enter a valid email address." }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters." })
            .max(20, { message: "Password must be at most 20 characters." })
            .regex(/(?=.*[A-Z])/, {
                message: "Password must contain at least one uppercase letter.",
            })
            .regex(/(?=.*[a-z])/, {
                message: "Password must contain at least one lowercase letter.",
            })
            .regex(/(?=.*\d)/, {
                message: "Password must contain at least one digit.",
            })
            .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
                message: "Password must contain at least one special character.",
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    })