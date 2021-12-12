import React, {useEffect, useState} from "react";
import {
    Button, Text, View,
    StyleSheet, SafeAreaView,
} from 'react-native';
import API from "../../api/API";
import {Calendar ,Agenda, CalendarList} from "react-native-calendars"
import {NavigationContainer} from "@react-navigation/native";
import ScreenName from '../ScreenNames';
import HistoryDetailScreen from './detail/HistoryDetailScreen';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {selectedDayBackgroundColor} from "react-native-calendars/src/style";
import HistoryInfo from "../../model/History"
import User from "../../model/User"

const HistoryDetailScreenName =ScreenName.HistoryDetailScreenName;

const cur_date=Date();

function HistoryScreenHome({route, navigation}){
    const [loggedIn, setLoggedIn] = useState(true);
    const [markedDate,setMarkedDate]=useState({});
    const [myHistoryInfo,setMyHistoryInfo]=useState();
    const logout = () => {
        API.auth.logout().then((response)=>{
            setLoggedIn(false);
        });
    }

    useEffect(()=>{
        getMyHistoryInfo();
    }, [myHistoryInfo]);

    const getMyHistoryInfo=()=>{
            const tmpHistoryInfo= User.getMyHistory();
            const dateOfHistory=Object.keys(tmpHistoryInfo);
            const marked={};
            dateOfHistory.map((date)=>{
                let sum=0;
                tmpHistoryInfo[`${date}`].map((oneMeal)=>{
                    sum=sum+oneMeal.totalKcal;
                });
                marked[date]={customStyles:
                        {
                            container:{
                                backgroundColor:
                                    sum >= 2000
                                        ? 'red'
                                        : sum>1000
                                            ? '#70d7c7'
                                            :'orange'
                            },
                            text:{color:'white',}
                        }
                };
            });
            setMarkedDate(marked);
            setMyHistoryInfo(tmpHistoryInfo);
    }
    return(
    <SafeAreaView style={styles.HistoryContainer}>
        <View style={styles.Header}>
            <Text style={styles.Title}>
                History
            </Text>
        </View>
        <View style={styles.CalendarContainer}>
            <CalendarList
                markingType={'custom'}
                markedDates={markedDate}
                style={styles.CurMonth}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={'2021-01-01'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={cur_date}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {
                    const date = day.dateString;
                    navigation.navigate(HistoryDetailScreenName, {
                        selectedDate: date,
                        oneDayInfo: myHistoryInfo[`${date}`]
                    });
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'yyyy MM'}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                disableAllTouchEventsForDisabledDays={true}
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={12}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={0}
                // Enable or disable scrolling of calendar list
                scrollEnabled={true}
                // Enable or disable vertical scroll indicator. Default = false
                showScrollIndicator={true}
            />
        </View>
        <View style={styles.Footer}>
            <View style={styles.LogoutButton}>
                <Button title={'로그아웃 (테스트용)'}
                        color='#fff'
                        onPress={() => {
                            logout();
                        }}

                />
            </View>
        </View>
    </SafeAreaView>);
}

export default function HistoryScreen({route, navigation}) {
    const Stack = createNativeStackNavigator();
    return(<Stack.Navigator>
            <Stack.Screen name ='나의 월간 기록' component={HistoryScreenHome} />
            <Stack.Screen name={HistoryDetailScreenName} component={HistoryDetailScreen} />
        </Stack.Navigator>);
}

const styles=StyleSheet.create({
    Header:{
        flex:0.5,
        width: '100%',
        padding: 15,
    },
    Title:{
        fontSize: 45,
        fontWeight: '900',
        fontStyle: 'italic',
        color: '#5048e5',
    },
   CurMonth:{
       width:'100%',
   },
   CalendarContainer:{
       flex:3,
       paddingBottom:0,
       shadowOffset: {
           width: 0,
           height: 7,
       },
       shadowOpacity: 0.25,
       shadowRadius: 9.0,
       elevation: 15,
   },
   Footer:{
       flex:1,
       justifyContent:"center",
   },
    LogoutButton:{
        backgroundColor: '#5048e5',
        borderRadius: 10,
        width: '60%',
        alignSelf:"center",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },
   HistoryContainer:{
       flex:1,
     flexDirection:"column",
     justifyContent:"space-around",
       backgroundColor:'white',
   }
});