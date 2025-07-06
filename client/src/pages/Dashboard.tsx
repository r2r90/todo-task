import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {LeftSidebar} from "@/components/left-sidebar/LeftSidebar.tsx";
import TodoForm from "@/components/dashboard/TodoForm.tsx";
import {TasksTabs} from "@/components/dashboard/TasksTabs.tsx";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/AuthContext";
import {useNavigate} from "react-router-dom";
import {ConfirmDialog} from "@/components/ui/ConfirmDialog";
import {toast} from "sonner";


export default function Page() {
    const navigate = useNavigate()
    const {logout} = useAuth()

    const handleLogout = async () => {
        await logout()
        localStorage.setItem('logout-success', '1');
        navigate('/login', {replace: true})
        toast.success("You have been logged out successfully.");
    }

    return (
        <SidebarProvider>
            <LeftSidebar/>
            <SidebarInset>
                <header
                    className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <ConfirmDialog
                        triggerLabel={
                            <Button onClick={(e) => e.stopPropagation()}>
                                Logout
                            </Button>
                        }
                        title="Log out?"
                        description="You will be signed out of your account. Do you want to continue?"
                        confirmLabel="Logout"
                        onConfirm={handleLogout}
                        variant="destructive"
                    />

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

