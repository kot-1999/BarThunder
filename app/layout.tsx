'use client'

import "./globals.css";
import {ConfigProvider, FloatButton, Layout, Menu, message, Space, Typography} from "antd";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UpOutlined } from "@ant-design/icons";
import ChuckNorrisJoke from "@/app/components/ChuckNorris";
import {AuthProvider} from "@/app/src/authContent";
import AppHeader from "@/app/components/AppHeader";

const { Content, Footer } = Layout;
const { Text } = Typography;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const year = new Date().getFullYear();


    // useEffect(() => {
    //     // Restore scroll position
    //     const handleBeforeUnload = () => {
    //         sessionStorage.setItem('scrollY', String(window.scrollY));
    //     };
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     const scrollY = sessionStorage.getItem('scrollY');
    //     if (scrollY) window.scrollTo(0, Number(scrollY));
    //     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    // }, []);



    return (
        <html lang="en">
        <body suppressHydrationWarning>
        <AuthProvider>

        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#53bf14", // primary color
                    borderRadius: 8,          // global border radius
                    fontSize: 16,             // base font size
                    colorTextBase: "#302f2f",    // base text color
                },
            }}
        >
                <Layout style={{ minHeight: "100vh" }}>
                   <AppHeader/>

                    <Content style={{ padding: 24 }}>
                        <ChuckNorrisJoke key={searchParams.toString()} />
                        <FloatButton.BackTop
                            icon={<UpOutlined />}
                            style={{
                                right: 50,
                                bottom: 50,
                                width: 64,
                                height: 64,
                                boxShadow: '-moz-initial',
                                borderWidth: 5,
                            }}
                        />
                        {children}
                    </Content>

                    <Footer style={{ textAlign: "center", marginTop: 40 }}>
                        <Space orientation="vertical" size={4}>
                            <Text>🍸 Cocktail Library — Discover and explore cocktail recipes</Text>
                            <Space size="large">
                                <Link href="/">Home</Link>
                                <Link href="https://demo.barassistant.app/bar/docs#/" target="_blank">
                                    Bar Assistant API
                                </Link>
                                <Link href="https://github.com/kot-1999/BarThunder" target="_blank">
                                    GitHub
                                </Link>
                            </Space>
                            <Text type="secondary">© {year} Bar Thunder App</Text>
                        </Space>
                    </Footer>
                </Layout>
        </ConfigProvider>
        </AuthProvider>

        </body>
        </html>
    );
}