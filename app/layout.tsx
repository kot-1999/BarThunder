'use client'

import "./globals.css";

import {Layout, Menu, Space} from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {Footer} from "antd/es/layout/layout";
import Text from "antd/es/typography/Text";

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
                            { key: "/drinks/new", label: <Link href="/cocktail/new">Add Cocktail</Link> },
                            { key: "/login", label: <Link href="/login">Login</Link> },
                        ]}
                    />
                </Header>

                <Content style={{ padding: 24 }}>
                    {children}
                </Content>

                <Footer style={{ textAlign: "center", marginTop: 40 }}>
                    <Space direction="vertical" size={4}>
                        <Text>
                            🍸 Cocktail Library — Discover and explore cocktail recipes
                        </Text>

                        <Space size="large">
                            <Link href="/">Home</Link>
                            <Link href="https://demo.barassistant.app/bar/docs#/" target="_blank">
                                Bar Assistant API
                            </Link>
                            <Link href="https://github.com/kot-1999/BarThunder" target="_blank">
                                GitHub
                            </Link>
                        </Space>

                        <Text type="secondary">
                            © {new Date().getFullYear()} Bar Thunder App
                        </Text>
                    </Space>
                </Footer>
            </Layout>
        </body>
        </html>
    );
}