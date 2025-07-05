import Dashboard from "@/pages/Dashboard.tsx";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import RegisterPage from "@/pages/RegisterPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import {ListsProvider} from "@/hooks/ListsContext.tsx";
import {TasksProvider} from "./hooks/TasksContext";
import {RequireAuth} from "@/components/auth/RequireAuth.tsx";
import {useAuth} from "./hooks/use-auth.hook";


function App() {
    const {accessToken} = useAuth()

    return (
        <BrowserRouter>
            <ListsProvider>
                <TasksProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to={accessToken ? "/dashboard" : "/login"} replace/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>

                        <Route
                            path="/dashboard/*"
                            element={
                                <RequireAuth>
                                    <Dashboard />
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </TasksProvider>
            </ListsProvider>
        </BrowserRouter>
    )
}

export default App