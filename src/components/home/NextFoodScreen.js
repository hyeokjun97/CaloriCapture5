import {Text, View, Button, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView} from "react-native";
import React, {useEffect, useState} from 'react';
import HistoryInfo from '../../model/History'
import ScreenNames from "../ScreenNames";
//import "src/components/Food_Photo"
const RecommendChooseScreenName=ScreenNames.RecommendChooseScreenName;
const NextFoodScreenName=ScreenNames.NextFoodScreenName;

import Config from "../../api/Config";

import {Grid, LineChart, XAxis, YAxis} from "react-native-svg-charts";
import HistoryStorage from "../../model/HistoryStorage";
import DetailNutritionGraph from "./detail/DetailNutritionGraph";
import User from "../../model/User";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HistoryDetailScreen from "./detail/HistoryDetailScreen";
import RecommendChooseScreen from "./RecommendChoose";

//Home SCREEN
function NextFoodHomeScreen({route, navigation}) {
    //DATA EXAMPLE
    const oneDayInfo=HistoryStorage.getHistory(User.getMyId())[`${HistoryInfo.convertDateFormat(new Date())}`];
    const [myDetailHistory, setMyDetailHistory] = useState([]);
    const [myMealsTotal, setMyMealsTotal] = useState({});
    const Today = HistoryInfo.convertDateFormat(new Date());
    useEffect(() => {
        (async () => {
            await getMyDetailHistory(oneDayInfo);
        })();
    }, [myMealsTotal]);
    const getMyDetailHistory = async (oneDayInfo) => {
        const mealsDetailList = await Promise.all(
            oneDayInfo.map((oneMeal) => {
                return HistoryStorage.getMultipleFoodInfo(...oneMeal.foodList);
            }));
        const mealsTotalList = await Promise.all(
            oneDayInfo.map((oneMeal) => {
                return HistoryStorage.getTotalFoodNutritions(...oneMeal.foodList);
            })
        )
        setMyMealsTotal(mealsTotalList);
        setMyDetailHistory(mealsDetailList);
    }
    return (<SafeAreaView style={styles.Container}>
            <View style={styles.header}>
                <Text style={styles.TodaysMeal}>
                    Today's MEAL</Text>
            </View>
            <ScrollView style={styles.body1} horizontal={true} showsHorizontalScrollIndicator={false}>
                {
                    oneDayInfo?.map((oneMeal)=>{
                        return <View style={styles.item1}>
                            {
                                oneMeal.foodList.map((food)=>{
                                    return <Text>{food}, </Text>;
                                })
                            }
                        </View>
                    })
                }
            </ScrollView>
            <View style={styles.body2} showsVerticalScrollIndicator={true}>
                <ScrollView style={{flexDirection: "column"}}>
                    <DetailNutritionGraph
                        dateString='Today'
                        myDetailHistory={myDetailHistory}
                        myMealsTotal={myMealsTotal}
                        oneDayInfo={oneDayInfo}/>
                </ScrollView>
            </View>
            <View style={styles.body3}>
                <TouchableOpacity style={styles.NextMealRecomendationBtn}
                    onPress={()=>{
                        navigation.navigate(RecommendChooseScreenName);
                    }}>
                    <Text style={styles.NextMealRecomendationTxt}>Next Meal Recomendation</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default function NextFoodScreen({route, navigation}) {
    const Stack = createNativeStackNavigator();
    return(<Stack.Navigator>
        <Stack.Screen name ='오늘 식단기록' component={NextFoodHomeScreen} />
        <Stack.Screen name={RecommendChooseScreenName} component={RecommendChooseScreen}/>
    </Stack.Navigator>);
}
const styles = StyleSheet.create({ //Screen View Components - JUN

    Container: { //container
        flex: 1,
        backgroundColor: '#fff',
        margin: 10,
    },
    /*Structure: header - body 1, 2 - footer*/
    header: { //TODAY's MEAL
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        margin : 10,
    },
    body1: { //PREVIOUS MEAL PHOTO
        flex: 2,
        flexDirection: 'row',
        //justifyContent: 'space-around',
        paddingBottom:10,
        paddingLeft:10,
        backgroundColor: '#ffffff',
        //backgroundColor:'red'
    },
    body2: { //GRAPH
        flex:5,
        backgroundColor: '#ffffff',
        paddingLeft:15,
        //borderRadius: '5%',
    },
    body3: { //NEXT MEAL RECOMENDATION
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TodaysMeal: {
        width: '100%',
        height: '60%',
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 30,
        fontWeight: '700',
        color: '#5048e5',
    },
    NextMealRecomendationBtn: {
        backgroundColor: '#5048e5',
        borderRadius: 10,
        width: '80%',
        height: '60%',
        marginBottom: 20,
        alignItems: "center",
        //shadow
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },
    NextMealRecomendationTxt: {
        //textAlignVertical: 'center',
        paddingTop: '5%',
        textAlign: 'center',
        width: '80%',
        height: '80%',
        fontSize: 20,
        fontWeight: '800',
        color: '#ffffff',
    },
    item1: {
        marginBottom:5,
        marginRight:5,
        backgroundColor: '#cccccc',
        height: '100%',
        width: 100,
        //shadow
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
    },
});
