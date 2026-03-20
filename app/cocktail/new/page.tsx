'use client'

import { useState } from "react";
import { Form, Input, Button, Select, Space, InputNumber } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { showError } from "@/app/src/helpers";
import { nanoid } from 'nanoid';

export default function CocktailUploadForm() {
    const [form] = Form.useForm();

    const [ingredientSearch, setIngredientSearch] = useState<{ [key: number]: string }>({});
    const [ingredientOptionsMap, setIngredientOptionsMap] = useState<{ [key: number]: any[] }>({});

    const [glassOptions, setGlassOptions] = useState<any[]>([]);
    const [glassSearch, setGlassSearch] = useState('');

    const [methodOptions, setMethodOptions] = useState<any[]>([]);
    const [methodSearch, setMethodSearch] = useState('');

    const handleGlassSearch = async (value?: string) => {
        if (value)
            setGlassSearch(value)

        try {
            const res = await (value ? fetch(`/api/glasses?search=${encodeURIComponent(value)}`) : fetch(`/api/glasses`));
            const result = await res.json();

            if (!res.ok) {
                showError(result);
                return;
            }
            console.log(result);
            setGlassOptions(
                result.data.map((item: any) => ({
                    label: item.name,
                    value: item.id
                }))
            );
        } catch (err) {
            showError(err);
        }
    };

    const handleMethodSearch = async (value?: string) => {
        if (value)
            setGlassSearch(value)

        try {
            const res = await (value ? fetch(`/api/methods?search=${encodeURIComponent(value)}`) : fetch(`/api/methods`));
            const result = await res.json();

            if (!res.ok) {
                showError(result);
                return;
            }

            setMethodOptions(
                result.data.map((item: any) => ({
                    label: item.name,
                    value: item.id
                }))
            );
        } catch (err) {
            showError(err);
        }
    };

    // Handle ingredient search
    const handleIngredientSearch = async (fieldKey: number, value?: string) => {
        // Update search value per field
        if (value)
            setIngredientSearch(prev => ({ ...prev, [fieldKey]: value }));

        if (!value) {
            setIngredientOptionsMap(prev => ({ ...prev, [fieldKey]: [] }));
        }

        try {
            const res = await (value ? fetch(`/api/ingredients?search=${encodeURIComponent(value)}`) : fetch(`/api/ingredients`));
            const result = await res.json();
            if (!res.ok) {
                showError(result);
                return;
            }

            // Save options for this specific field
            setIngredientOptionsMap(prev => ({
                ...prev,
                [fieldKey]: result.data.map((item: any) => ({
                    label: item.name,
                    value: item.id
                }))
            }));
        } catch (err) {
            showError(err);
        }
    };

    const onFinish = (values: any) => {
        // Combine instructions array into numbered string
        const instructionsStr = values.instructions
            .map((step: string, i: number) => `${i + 1}. ${step}`)
            .join('\n');

        // Prepare ingredients array
        const ingredientsArr = values.ingredients.map((ing: any) => ({
            ingredient_id: ing.ingredient.value,
            name: ing.ingredient.label,
            amount: ing.amount
        }));

        const payload = {
            name: values.name,
            description: values.description,
            garnish: values.garnish,
            glass_id: values.glass_id,
            method_id: values.method_id,
            instructions: instructionsStr,
            ingredients: ingredientsArr
        };

        console.log("Payload to submit:", payload);

        // Here you would send payload to backend
        // fetch('/api/cocktails', { method: 'POST', body: JSON.stringify(payload), headers: {...} })
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>

            <Form.Item name="name" label="Cocktail Name" rules={[{ required: true }]}>
                <Input placeholder="Enter cocktail name" />
            </Form.Item>

            <Form.List name="instructions" initialValue={['']}>
                {(fields, { add, remove }) => (
                    <div>
                        <label>Instructions</label>
                        {fields.map((field, index) => (
                            <Space key={nanoid()} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                                <Form.Item
                                    {...field}
                                    name={[field.name]}
                                    rules={[{ required: true, message: 'Please input step' }]}
                                >
                                    <Input placeholder={`Step ${index + 1}`} />
                                </Form.Item>
                                {fields.length > 1 && (
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                )}
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Step
                            </Button>
                        </Form.Item>
                    </div>
                )}
            </Form.List>

            <Form.Item name="description" label="Description">
                <Input.TextArea placeholder="Cocktail description" rows={3} />
            </Form.Item>

            <Form.Item name="garnish" label="Garnish">
                <Input placeholder="Garnish (e.g., lemon twist)" />
            </Form.Item>

            <Form.Item name="glass" label="Glass" rules={[{ required: true, message: 'Select glass' }]}>
                <Select
                    showSearch
                    placeholder="Type to search glass"
                    labelInValue
                    allowClear
                    filterOption={false}
                    options={glassOptions}
                    onSearch={handleGlassSearch}
                    onFocus={() => handleGlassSearch()}
                />
            </Form.Item>

            <Form.Item name="method" label="Method" rules={[{ required: true, message: 'Select method' }]}>
                <Select
                    showSearch
                    placeholder="Type to search method"
                    labelInValue
                    allowClear
                    filterOption={false}
                    options={methodOptions}
                    onSearch={handleMethodSearch}
                    onFocus={() => handleMethodSearch()}
                />
            </Form.Item>

            <Form.List name="ingredients" initialValue={[{ ingredient: null, amount: '' }]}>
                {(fields, { add, remove }) => (
                    <div>
                        <label>Ingredients</label>
                        {fields.map((field, index) => (
                            <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'ingredient']}
                                    rules={[{ required: true, message: 'Select ingredient' }]}
                                    style={{ width: 250 }}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Type to search ingredient"
                                        labelInValue
                                        allowClear
                                        filterOption={false}
                                        options={ingredientOptionsMap[field.key] || []} // use per-field options
                                        value={ingredientSearch[field.key] ? { label: ingredientSearch[field.key], value: undefined } : undefined}
                                        onSearch={(val) => handleIngredientSearch(field.key, val)}
                                        onFocus={() => handleIngredientSearch(field.key)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    {...field}
                                    name={[field.name, 'amount']}
                                    rules={[{ required: true, message: 'Enter amount' }]}
                                >
                                    <Input placeholder="Amount (e.g., 50ml)" />
                                </Form.Item>

                                {fields.length > 1 && (
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                )}
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Ingredient
                            </Button>
                        </Form.Item>
                    </div>
                )}
            </Form.List>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Create Cocktail
                </Button>
            </Form.Item>
        </Form>
    );
}