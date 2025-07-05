import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {LeftSidebar} from "@/components/left-sidebar/LeftSidebar.tsx";
import TodoForm from "@/components/main/TodoForm.tsx";
import {TasksTabs} from "@/components/main/TasksTabs.tsx";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/hooks/use-auth.hook";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";


export default function Page() {
    const navigate = useNavigate()
    const {logout} = useAuth()

    const handleLogout = async () => {
        await logout()
        navigate('/login', {replace: true})
        toast.success("Logout successful")
    }

    return (
        <SidebarProvider>
            <LeftSidebar/>
            <SidebarInset>
                <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Button onClick={handleLogout}>Logout</Button>
                </header>
                <div className="overflow-y-auto flex-1 flex">

                    <div className="w-1/2 overflow-auto p-4">
                        <TasksTabs/>
                    </div>
                    <div className="w-1/2 border-r overflow-auto">
                        <TodoForm/>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

