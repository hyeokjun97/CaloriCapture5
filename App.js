/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// In App.js in a new project
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NextFoodScreen from "./src/components/home/NextFoodScreen";
import CameraScreen from "./src/components/home/CameraScreen";
import HistoryScreen from "./src/components/home/HistoryScreen";
//Commit By Hyeok Jun

function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function App() {

    const NextFoodScreenName = '식단 추천';
    const CameraScreenName = '식단 촬영';
    const HistoryScreenName = '나의 기록';

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === NextFoodScreenName) {
                            iconName = focused
                                ? 'ios-information-circle'
                                : 'ios-information-circle-outline';
                        }
                        if (route.name === CameraScreenName) {
                            iconName = focused
                                ? 'ios-camera'
                                : 'ios-camera-outline';
                        }
                        if (route.name === HistoryScreenName) {
                            iconName = focused
                                ? 'ios-list'
                                : 'ios-list-outline';
                        }

                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name={NextFoodScreenName} component={NextFoodScreen} />
                <Tab.Screen name={CameraScreenName} component={CameraScreen} />
                <Tab.Screen name={HistoryScreenName} component={HistoryScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
