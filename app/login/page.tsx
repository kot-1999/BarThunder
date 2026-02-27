'use client';

import { Form, Input, Button, Card, message } from "antd";

export default function LoginPage() {

    const onFinish = async (values: any) => {
        console.log("Login data:", values);

        message.success("Login submitted");

        // later:
        // await fetch('/api/login', ...)
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
            }}
        >
            <Card title="Login" style={{ width: 400 }}>
                <Form layout="vertical" onFinish={onFinish}>

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
                        rules={[
                            { required: true, message: "Password required" },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>

                </Form>
            </Card>
        </div>
    );
}