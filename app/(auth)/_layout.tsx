//import liraries
import { Stack } from 'expo-router';
import React from 'react';

// create a component
const _Layout = () => {
    return (
        <Stack
        >
            <Stack.Screen 
            name='login'
            options={{headerShown: false}}
            />

            <Stack.Screen 
            name='signup'
            options={{headerShown: false}}
            />
        </Stack>
    );
};

//make this component available to the app
export default _Layout;
