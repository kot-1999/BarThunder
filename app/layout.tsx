'use client'

import "./globals.css";

import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Content } = Layout;

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <html lang="en">
        <body>
            <Layout style={{ minHeight: "100vh" }}>
                <Header>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={[pathname]}
                        items={[
                            { key: "/", label: <Link href="/">Home</Link> },
                            { key: "/content", label: <Link href="/content">Content</Link> },
                            { key: "/about", label: <Link href="/about">About</Link> },
                            { key: "/drinks/new", label: <Link href="/app/cocktail/new">Add Cocktail</Link> },
                            { key: "/login", label: <Link href="/login">Login</Link> },
                        ]}
                    />
                </Header>

                <Content style={{ padding: 24 }}>
                    {children}
                </Content>
            </Layout>
        </body>
        </html>
    );
}