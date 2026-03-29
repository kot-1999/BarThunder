'use client';

import { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import Image from 'next/image';

const { Paragraph } = Typography;

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
    const [open, setOpen] = useState(false);

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

        setIcon(icons[Math.floor(Math.random() * icons.length)]);
        fetchJoke();
    }, []);

    return (
        <div
            className={`
                fixed bottom-30 right-0 z-[1000] max-w-150 cursor-pointer
                transition-transform duration-300 ease-in-out
                ${open ? 'translate-x-0' : 'translate-x-4/5'}
            `}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={() => setOpen(!open)}
        >
            <Card hoverable size="small">
                <div className="flex items-center gap-3">
                    {icon && (
                        <Image
                            src={icon}
                            alt="Chuck Norris"
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                    )}
                    <Paragraph className="m-0">
                        {joke || 'Loading joke...'}
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
}