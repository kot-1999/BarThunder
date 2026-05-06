'use client';

import {Form, Input, Button, Card, Tabs, message} from "antd";
import {showError} from "@/app/src/helpers";
import {useAuth} from "@/app/src/authContent";

export default function AuthCard() {
    const { checkAuth } = useAuth();

    const onLoginFinish = (values: unknown) => {
        onFinish(values, 'login');
    }

    const onRegisterFinish = (values: unknown) => {
        onFinish(values, 'register');
    }

    const onFinish = async (values: any, mode: 'login' | 'register') => {
        try {
            const payload = { ...values, mode };
            const res = await fetch("/api/auth", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            await checkAuth()
            if (res.ok) {
                message.success(`${mode === 'login' ? 'Login' : 'Registration'} successful`);
            } else {
                showError(data)
            }
        } catch (err) {
            message.error('Network error');
        }
    };

    const items = [
        {
            key: "login",
            label: "Login",
            children: (
                <Form layout="vertical" onFinish={onLoginFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email required" },
                            { type: "email" },
                        ]}
                    >
                        <Input placeholder="email@example.com" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Password required" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </Form>
            ),
        },
        {
            key: "register",
            label: "Register",
            children: (
                <Form layout="vertical" onFinish={onRegisterFinish}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Name required" }]}
                    >
                        <Input placeholder="John Doe" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email required" },
                            { type: "email" },
                        ]}
                    >
                        <Input placeholder="email@example.com" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Password required" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Repeat password"
                        name="passwordRepeat"
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: "Please repeat password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("Passwords do not match")
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Register
                    </Button>
                </Form>
            ),
        },
    ];

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 80,
            }}
        >
            <Card title="Authorization" style={{ width: 400 }}>
                <Tabs defaultActiveKey="login" items={items} centered />
            </Card>
        </div>
    );
}