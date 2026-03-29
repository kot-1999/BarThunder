'use client'

import { useState } from "react";
import {Form, Input, Button, Select, Space, Upload, Checkbox, Row, Col} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { showError } from "@/app/src/helpers";
import { nanoid } from 'nanoid';
import ChuckNorrisJoke from "@/app/components/ChuckNorris";

export default function CocktailUploadForm() {
    const [form] = Form.useForm();

    const [ingredientSearch, setIngredientSearch] = useState<{ [key: number]: string }>({});
    const [ingredientOptionsMap, setIngredientOptionsMap] = useState<{ [key: number]: any[] }>({});

    const [glassOptions, setGlassOptions] = useState<any[]>([]);
    const [glassSearch, setGlassSearch] = useState('');

    const [methodOptions, setMethodOptions] = useState<any[]>([]);
    const [methodSearch, setMethodSearch] = useState('');

    const [file, setFile] = useState<UploadFile | null>(null);
    const [uploadedImage, setUploadedImage] = useState<any | null>(null)

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

    const handleUpload = async ({ file, onSuccess, onError }: any) => {
        try {
            const formData = new FormData();
            formData.append('images[0][image]', file);
            formData.append('images[0][sort]', '1');

            const res = await fetch('/api/image', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                showError(data);
                onError?.(data);
                return;
            }

            const uploaded = data.data?.[0]; // your backend should return {id, url, ...}

            // Update fileList so AntD shows preview
            const updatedFile: UploadFile = {
                uid: file.uid,
                name: file.name,
                status: 'done',
                url: uploaded?.url,  // <-- THIS IS KEY
            };

            setFile(updatedFile);
            setUploadedImage(uploaded);

            onSuccess?.(data);
        } catch (err) {
            showError(err);
            onError?.(err);
        }
    };

    const handleMethodSearch = async (value?: string) => {
        if (value)
            setMethodSearch(value)

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

    const onFinish = async (values: any) => {
        // Combine instructions array into numbered string
        try {
            const instructionsStr = values.instructions
                .map((step: string, i: number) => `${i + 1}. ${step}`)
                .join('\n');
            console.log(values)
            // Prepare ingredients array
            const ingredientsArr = values.ingredients.map((ing: any) => ({
                ingredient_id: ing.ingredient.value,
                name: ing.ingredient.label,
                amount: Number(ing.amount),
                units: 'ml',
                optional: ing.optional
            }));

            console.log('???????????????', ingredientsArr);

            const payload = {
                name: values.name,
                description: values.description,
                garnish: values.garnish,
                glass_id: values.glass.value,
                method_id: values.method.value,
                instructions: instructionsStr,
                ingredients: ingredientsArr,
                images: uploadedImage?.id ? [uploadedImage?.id] : undefined
            };
            console.log('!!!!!!!!!!!!', payload);

            const res = await fetch(`/api/cocktails`, {
                method: 'POST',
                body: JSON.stringify(payload),
            })

            const result = await res.json();

            if (!res.ok) {
                showError(result);
                return;
            }

        }catch(err) {
            showError(err);
        }

        // Here you would send payload to backend
        // fetch('/api/cocktails', { method: 'POST', body: JSON.stringify(payload), headers: {...} })
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <ChuckNorrisJoke/>
            <Form.Item name="name" label="Cocktail Name" rules={[{ required: true, message: 'Name is required' }]}>
                <Input placeholder="Enter cocktail name" />
            </Form.Item>

            <Form.Item label="Cocktail Image">
                <Upload
                    listType="picture-card"
                    fileList={file ? [file] : []} // single file
                    customRequest={handleUpload}
                    onRemove={() => {
                        setFile(null);
                        setUploadedImage(null);
                    }}
                    maxCount={1}
                >
                    {!file && (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    )}
                </Upload>
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
                                    rules={[{ required: true, message: 'Enter preparation step' }]}
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

            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Provide description' }]}>
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

            <Form.List name="ingredients" initialValue={[{ ingredient: null, amount: '', optional: false }]}>
                {(fields, { add, remove }) => (
                    <div >
                        <label>Ingredients</label>

                        {fields.map((field) => (
                            <div
                                key={field.key}
                                className="bg-white border border-gray-200 rounded-lg p-3 mb-3 transition hover:shadow-sm"
                            >
                            <Row key={field.key} gutter={8} style={{ marginBottom: 8 }}>

                                {/* Ingredient */}
                                <Col xs={24} sm={12} md={10}>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'ingredient']}
                                        rules={[{ required: true, message: 'Select ingredient' }]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Ingredient name"
                                            labelInValue
                                            allowClear
                                            filterOption={false}
                                            options={ingredientOptionsMap[field.key] || []}
                                            onSearch={(val) => handleIngredientSearch(field.key, val)}
                                            onFocus={() => handleIngredientSearch(field.key)}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* Amount */}
                                <Col xs={12} sm={6} md={4}>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'amount']}
                                        rules={[{ required: true, message: 'ml' }]}
                                    >
                                        <Input placeholder="ml" />
                                    </Form.Item>
                                </Col>

                                {/* Optional */}
                                <Col xs={12} sm={6} md={4}>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'optional']}
                                        valuePropName="checked"
                                    >
                                        <Checkbox>Optional</Checkbox>
                                    </Form.Item>
                                </Col>

                                {/* Remove button */}
                                <Col xs={24} sm={24} md={2}>
                                    {fields.length > 1 && (
                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                    )}
                                </Col>

                            </Row>
                            </div>
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