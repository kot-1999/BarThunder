'use client'

import { Card, Row, Col, Tag, List, Typography, Divider } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function CocktailList({ cocktails }: any) {
    return (
        <main style={{ padding: 24 }}>
            <Title level={2}>Cocktails 🍸</Title>

            <Row gutter={[16, 16]}>
                {cocktails.map((drink: any) => (
                    <Col xs={24} sm={12} lg={8} key={drink.id}>
                        <Card
                            cover={
                                drink.images?.length && (
                                    <img
                                        src={drink.images[0].url}
                                        alt={drink.name}
                                        style={{ height: 350, objectFit: "cover" }}
                                    />
                                )
                            }
                        >
                            <Title level={4}>{drink.name}</Title>

                            <Paragraph>{drink.description}</Paragraph>

                            {drink.tags?.map((tag: { name: string }) => (
                                <Tag key={tag.name}>{tag.name}</Tag>
                            ))}

                            <Divider />

                            <Text strong>Glass:</Text> {drink.glass?.name}<br />
                            <Text strong>Method:</Text> {drink.method?.name}<br />
                            <Text strong>ABV:</Text> {drink.abv}%<br />

                            <Divider />

                            <Title level={5}>Ingredients</Title>

                            <List
                                size="small"
                                dataSource={drink.ingredients}
                                renderItem={(ing: any) => (
                                    <List.Item>
                                        {ing.amount} {ing.units} {ing.ingredient.name}
                                        {ing.optional && (
                                            <Tag color="orange" style={{ marginLeft: 8 }}>
                                                optional
                                            </Tag>
                                        )}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </main>
    );
}