import Dashboard from "@/pages/Dashboard.tsx";
import {BrowserRouter, Navigate, Route, Routes,} from 'react-router-dom';
import RegisterPage from "@/pages/RegisterPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import {ListsProvider} from "@/context/ListsContext.tsx";
import {TasksProvider} from "./context/TasksContext";
import {RequireAuth} from "@/components/auth/RequireAuth.tsx";
import {Toaster} from "sonner";
import {AuthProvider} from "@/context/AuthContext";


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster position="top-center"/>
                <Routes>
                    <Route path="*" element={<Navigate to="/login" replace/>}/>
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
        </AuthProvider>
    )
}

export default App