import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)

        try {
            const data = await login({ email, password })

            // Successful login
            if (data?.user) {
                setUser(data.user)
                return { success: true }
            } else {
                return { success: false, message: "Invalid email or password" }
            }
        } catch (err) {
            console.error("Login Error:", err)
            const errorMsg = err.response?.data?.message || 
                           err.message || 
                           "Invalid email or password. Please try again."
            return { success: false, message: errorMsg }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data?.user) {
                setUser(data.user)
                return { success: true }
            }
            return { success: false }
        } catch (err) {
            console.error("Register Error:", err)
            return { 
                success: false, 
                message: err.response?.data?.message || "Registration failed" 
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            return { success: true }
        } catch (err) {
            console.error("Logout Error:", err)
            return { success: false }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data?.user || null)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [])

    return { 
        user, 
        loading, 
        handleRegister, 
        handleLogin, 
        handleLogout 
    }
}