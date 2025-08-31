// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

export default function AdminRoute({ children }) {
    const { user, checkingAuth } = useUserStore();
    if (checkingAuth) return null;
    return user?.role === "admin" ? children : <Navigate to="/" replace />;
}
