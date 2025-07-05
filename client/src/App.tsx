import Dashboard from "@/pages/Dashboard.tsx";
import {BrowserRouter, Route, Routes,} from 'react-router-dom';
import RegisterPage from "@/pages/RegisterPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import {ListsProvider} from "@/hooks/ListsContext.tsx";
import {TasksProvider} from "./hooks/TasksContext";
import {RequireAuth} from "@/components/auth/RequireAuth.tsx";
import {Toaster} from "sonner";


function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" />
            <Routes>

                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>

                <Route
                    path="/dashboard/*"
                    element={
                        <RequireAuth>
                            <ListsProvider>
                                <TasksProvider>
                                    <Dashboard/>
                                </TasksProvider>
                            </ListsProvider>
                        </RequireAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App