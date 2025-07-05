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


function App() {
    // const token = localStorage.getItem('accessToken')

    return (
        <BrowserRouter>
            <ListsProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace/>}/>

                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>

                    <Route
                        path="/dashboard"
                        element={<Dashboard/>}
                    />
                </Routes>
            </ListsProvider>
        </BrowserRouter>
    )
}

export default App