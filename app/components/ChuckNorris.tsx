'use client';

import { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import Image from 'next/image';

const { Paragraph } = Typography;

// 👉 put your actual filenames here
const icons = [
    '/norris/01.png',
    '/norris/02.png',
    '/norris/03.png',
    '/norris/04.png',
    '/norris/05.png',
    '/norris/06.png',
    '/norris/07.png',
    '/norris/08.png',
];

export default function ChuckNorrisJoke() {
    const [joke, setJoke] = useState('');
    const [icon, setIcon] = useState('');

    useEffect(() => {
        const fetchJoke = async () => {
            try {
                const res = await fetch('https://api.chucknorris.io/jokes/random');
                const data = await res.json();
                setJoke(data.value);
            } catch {
                setJoke('Chuck Norris blocked the request.');
            }
        };

        const randomIcon =
            icons[Math.floor(Math.random() * icons.length)];

        setIcon(randomIcon);
        fetchJoke();
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1000,
                maxWidth: 600
            }}
        >
            <Card
                hoverable
                size="small"
            >
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    {icon && (
                        <Image
                            src={icon}
                            alt="Chuck Norris"
                            width={100}
                            height={100}
                        />
                    )}
                    <Paragraph>
                        {joke || 'Loading joke...'}
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
}