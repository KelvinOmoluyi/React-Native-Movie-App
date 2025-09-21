//import liraries
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, Text, View } from 'react-native';


const TabIcon = ({focused, icon, title}) => {

    if (focused) {
        return (
            <ImageBackground 
            source={images.highlight}
            className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-5 justify-center items-center rounded-full overflow-hidden'
            >
                <Image source={icon} tintColor="#151312" className="size-5" />
                <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
            </ImageBackground>
        )
    }

    return (
        <View className='size-full justify-center items-center rounded-full mt-4'>
            <Image source={icon} tintColor="#A8B5DB" className='size-5' />
        </View>
    )

}

// create a component
const _Layout = () => {
    return (
        <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
                width: "100%",
                height: "100%",
                display: 'flex',
                justifyContent: "center",
                alignItems: 'center'
            },
            tabBarStyle: {
                backgroundColor: "#0F0D23",
                borderRadius: 50,
                marginHorizontal: 20,
                marginBottom: 50,
                height: 53,
                position: "absolute",
                overflow: "hidden",
                borderColor: "#0F0D23"
            }
        }}
        >
            <Tabs.Screen 
            name='index'
            options={{
                title: 'Home', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <>
                        <TabIcon focused={focused} icon={icons.home} title="Home" />
                    </>
                )
            }}
            />

            <Tabs.Screen 
            name='search'
            options={{
                title: 'Search', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <>
                        <TabIcon focused={focused} icon={icons.search} title="Search" />
                    </>
                )
            }}
            />

            <Tabs.Screen 
            name='saved'
            options={{
                title: 'Saved', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <>
                        <TabIcon focused={focused} icon={icons.save} title="Saved" />
                    </>
                )
            }}
            />
            
            <Tabs.Screen 
            name='profile'
            options={{
                title: 'Profile', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <>
                        <TabIcon focused={focused} icon={icons.person} title="Profile" />
                    </>
                )
            }}
            />
        </Tabs>
    );
};

//make this component available to the app
export default _Layout;
