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
import API from "./src/api/API";
import LoginScreen from "./src/components/member/LoginScreen";
import RegisterScreen from "./src/components/member/RegisterScreen";
import HistoryDetailScreen from "./src/components/home/detail/HistoryDetailScreen";
import ScreenNames from "./src/components/ScreenNames";
import FoodDetailScreen from "./src/components/home/detail/FoodDetailScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//EDIT
import User from "./src/model/User"
import HistoryInfo from "./src/model/History"

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

    const [mainScreen, setMainScreen] = React.useState(null);

    const NextFoodScreenName = ScreenNames.NextFoodScreenName;
    const HistoryDetailScreenName=ScreenNames.HistoryDetailScreenName;
    const CameraScreenName = ScreenNames.CameraScreenName;
    const HistoryScreenName = ScreenNames.HistoryScreenName;
    const RegisterScreenName =ScreenNames.RegisterScreenName;
    const LoginScreenName=ScreenNames.LoginScreenName;

    const Stack = createNativeStackNavigator();
    const isLoggedIn = async () => {
        return await API.auth.isLogin();
    };
    const cur_Date=Date();
    const routeScreen = async () => {
        let loggedIn = await isLoggedIn();
        if (loggedIn){
            User.getMyInfo().then((myInfo)=>{
            const tmpHistoryInfo=new HistoryInfo(myInfo.id);
            User.setMyId(myInfo.id);
            User.setMyHistoryInfo(tmpHistoryInfo.historyList);
            const screen = <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            if (route.name === NextFoodScreenName) {
                                //route.params={selectedDate:cur_Date};
                                iconName = focused
                                    ? 'ios-home'
                                    : 'ios-home-outline';
                            }
                            if (route.name === CameraScreenName) {
                                iconName = focused
                                    ? 'ios-camera'
                                    : 'ios-camera-outline';
                            }
                            if (route.name === HistoryScreenName) {
                                iconName = focused
                                    ? 'ios-calendar'
                                    : 'ios-calendar-outline';
                            }

                            // You can return any component that you like here!
                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: '#5048e5',
                        tabBarInactiveTintColor: 'gray',
                        headerShown:false
                    })}>
                    <Tab.Screen name={NextFoodScreenName} component={NextFoodScreen}/>
                    <Tab.Screen name={CameraScreenName} component={CameraScreen} />
                    <Tab.Screen name={HistoryScreenName} component={HistoryScreen} />
                </Tab.Navigator>
            </NavigationContainer>;
            setMainScreen(screen);
            })
        }else{
            const screen = <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name ={LoginScreenName} component={LoginScreen} />
                    <Stack.Screen name={RegisterScreenName} component={RegisterScreen} />
                </Stack.Navigator>
            </NavigationContainer>;
            setMainScreen(screen);
        }
    };

    React.useEffect(()=>{
        // 추가 주석띠
        (async ()=>{
            await routeScreen();
        })();
    }, [mainScreen]);

    return mainScreen;
}
