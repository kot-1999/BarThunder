'use client'

import {Card, Row, Col, Tag, List, Typography, Divider, Button} from "antd";
import Link from "next/link";
import {Cocktail} from "@/app/src/types";
import {decodeText} from "@/app/src/helpers";

const { Title, Text, Paragraph } = Typography;

export default function CocktailList({ cocktails }: { cocktails: Cocktail[] }) {

    return (
        <main className="p-6">
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
                                        className="h-87.5 object-cover w-full"
                                    />
                                )
                            }
                        >
                            <Title level={4}>{drink.name}</Title>

                            <Paragraph ellipsis={{
                                rows: 3,
                                expandable: true,
                                symbol: "Show more"
                            }}>{decodeText(drink.description)}</Paragraph>

                            {drink.tags?.map((tag: { name: string }) => (
                                <Tag key={tag.name}>{tag.name}</Tag>
                            ))}

                            <Divider />

                            <Text strong>Glass:</Text> {drink.glass?.name}<br />
                            <Text strong>Method:</Text> {drink.method?.name}<br />
                            <Text strong>ABV:</Text> {drink.abv}%<br />

                            <Divider />

                            <Title level={5}>Ingredients</Title>

                            <div className="flex flex-wrap gap-2">
                                {drink.ingredients.map((ing, index) => (
                                    <Tag
                                        key={index}
                                        color={ing.optional ? 'orange' : 'blue'}
                                        style={{ marginBottom: 4 }}
                                    >
                                        {ing.ingredient.name}
                                    </Tag>
                                ))}
                            </div>
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