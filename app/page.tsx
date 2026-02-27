'use client';

import React from 'react';
import {Breadcrumb} from 'antd';

const App = () => {
    return <main>
        <Breadcrumb>
            <Breadcrumb.Separator>Sep</Breadcrumb.Separator>
            <Breadcrumb.Item>sample</Breadcrumb.Item>
            <Breadcrumb.Item>sample</Breadcrumb.Item>
            <Breadcrumb.Item>sample</Breadcrumb.Item>
        </Breadcrumb>
    </main>;
};

export default App;