// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

export default function ProtectedRoute({ children }) {
    const { user, checkingAuth } = useUserStore();
    if (checkingAuth) return null; // ή spinner
    return user ? children : <Navigate to="/login" replace />;
}
