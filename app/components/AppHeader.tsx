'use client'

import { Menu} from "antd";
import Link from "next/link";

import {Header} from "antd/es/layout/layout";
import {showError} from "@/app/src/helpers";
import {usePathname} from "next/navigation";
import {useAuth} from "@/app/src/authContent";

export default function AppHeader() {
    const pathname = usePathname();
    const { isAuthenticated, checkAuth } = useAuth();


    const onLogout = async () => {
        try {
            await fetch('/api/auth', { method: 'PUT' });
            await checkAuth();
            // message.success('Logged out')
        } catch (err) {
            showError(err)
        }
    }
    return (
        <Header>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[pathname]}
                items={[
                    { key: "/", label: <Link href="/">/:BarThunder</Link> },
                    { key: "/about", label: <Link href="/about">About</Link> },
                    isAuthenticated ? { key: "/myShelf", label: <Link href="/myShelf">My Shelf</Link> } : undefined,
                    !isAuthenticated ? { key: "/login", label: <Link href="/login">Login</Link> } : undefined,
                    isAuthenticated ? { key: "/logout", label: <Link href='/' onClick={onLogout}>Logout</Link> } : undefined
                ]}
            />
        </Header>
    );
}