'use client';

import { Input, Button, Form } from "antd";

export default function NewDrink() {
    return (
        <Form layout="vertical">
            <Form.Item label="Cocktail name">
                <Input />
            </Form.Item>

            <Form.Item label="Description">
                <Input.TextArea />
            </Form.Item>

            <Button type="primary">
                Add Cocktail
            </Button>
        </Form>
    );
}