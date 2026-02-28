'use server'
import React from 'react';
import {getOrCreateBar} from "@/app/src/getOrCreateBar";

const App = async () => {

    // let rootData = await getCookie('root')
    // console.log('rootData', rootData)
    // if (!rootData) {
    //     rootData = await getOrCreateBar()
    //     setCookie('root', rootData)
    // }

    await getOrCreateBar()

    // Here
    return <main>
        <h1>Home</h1>
    </main>;
};

export default App;