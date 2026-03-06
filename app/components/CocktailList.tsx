'use client'

import {Card, Row, Col, Tag, List, Typography, Divider, Button} from "antd";
import Link from "next/link";
import {Cocktail} from "@/app/src/types";

const { Title, Text, Paragraph } = Typography;

export default function CocktailList({ cocktails }: { cocktails: Cocktail[] }) {
    return (
        <main style={{ padding: 24 }}>
            <Title level={2}>Cocktails 🍸</Title>

            <Row gutter={[16, 16]}>
                {cocktails.map((drink) => (
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
                                renderItem={(ing) => (
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
                            <div className="flex justify-center mt-4">
                                <Link href={`/cocktail/${drink.id}`} passHref>
                                    <Button type="primary">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </main>
    );
}