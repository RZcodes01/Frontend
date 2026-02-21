import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("accessToken")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    // 1. If not logged in, go to login
    if (!token) return <Navigate to="/login" replace />

    // 2. If roles are specified and user role doesn't match, go home (Unauthorized)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute