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


function App() {
    // const token = localStorage.getItem('accessToken')

    return (
        <BrowserRouter>
            <ListsProvider>
                <TasksProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace/>}/>

                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>

                        <Route
                            path="/dashboard"
                            element={<Dashboard/>}
                        />
                    </Routes>
                </TasksProvider>
            </ListsProvider>
        </BrowserRouter>
    )
}

export default App