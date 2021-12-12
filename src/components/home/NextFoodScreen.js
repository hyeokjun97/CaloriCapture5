import {Text, View, Button, StyleSheet, TouchableOpacity, Image} from "react-native";
import React from 'react';
import HistoryInfo from '../../model/History'
//import "src/components/Food_Photo"


import Config from "../../api/Config";

import {Grid, LineChart, XAxis, YAxis} from "react-native-svg-charts";

//Home SCREEN
export default function NextFoodScreen({route, navigation}) {
    //DATA EXAMPLE
    const data = [ 30, 60, 90 ]
    const meal= ["아침", "점심", "저녁"]
    const data_kcal = [ 20, 50, 70 ]
    const data_protien = [ 45, 60, 70 ]
    const axesSvg = { fontSize: 14, fill: '#5048e5' };
    const verticalContentInset = { top: 5, bottom: 5 }
    const xAxisHeight = 20
    // JUN WOKRING
    return <View style={styles.Container}>
        <View style = {styles.header}>
            <Text style={styles.TodaysMeal}>Today's MEAL</Text>
        </View>
        <View style={styles.body1}>
            <Image style={styles.item3}
                   source={require('../Food_Photo/meal3.jpeg')}/>
            <Image style={styles.item2}
                   source={require('../Food_Photo/meal2.jpeg')}/>
            <Image style={styles.item1}
                   source={require('../Food_Photo/meal1.jpeg')}/>
        </View>
        <View style={styles.body2}>
            <View style={styles.GraphBox}>
                <Text style={styles.NutritionData}>Today's Nutrition Data</Text>
                <View style={{ height: "100%", padding: 20, flexDirection: 'row', top: 20, }}>
                    <YAxis
                        data={data}
                        style={{ marginBottom: xAxisHeight }}
                        contentInset={verticalContentInset}
                        svg={axesSvg}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <LineChart
                            style={{ flex: 1}}
                            data={data_protien}
                            contentInset={verticalContentInset}
                            svg={{ stroke: 'rgb(134, 65, 244)' }}
                        >
                            <Grid/>
                        </LineChart>

                        <XAxis
                            style={{ marginHorizontal: -10, height: xAxisHeight }}
                            data={meal}
                            formatLabel={(value, index) => value}
                            contentInset={{ left: 10, right: 10 }}
                            svg={axesSvg}
                        />
                    </View>
                </View>

            </View>
        </View>
        <View style={styles.body3}>
            <TouchableOpacity style = {styles.NextMealRecomendationBtn}>
                <Text style = {styles.NextMealRecomendationTxt}>Next Meal Recomendation</Text>
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({ //Screen View Components - JUN

    Container: { //container
        flex: 1,
        backgroundColor: '#fff',
    },
    /*Structure: header - body 1, 2 - footer*/
    header: { //TODAY's MEAL
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    body1: { //PREVIOUS MEAL PHOTO
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',

        backgroundColor: '#ffffff',

    },
    body2: { //GRAPH
        flex: 5,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',

        //borderRadius: '5%',
    },
    body3: { //NEXT MEAL RECOMENDATION
        flex: 2,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    /*Screen ELEMENTS*/
    TodaysMeal: {
        width: '100%',
        height: '80%',
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 30,
        fontWeight: '700',
        color: '#5048e5',
    },
    NutritionData: {
        position: 'absolute',
        width: '100%',
        height: '80%',
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 20,
        fontWeight: '500',
        color: '#5048e5',
    },
    NextMealRecomendationBtn: {
        backgroundColor: '#5048e5',
        borderRadius: 10,
        width: '80%',
        height: '60%',
        marginBottom:20,
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
        //flex: 1,
        backgroundColor: '#cccccc',
        height: '90%',
        width: '30%',
        //shadow
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },
    item2: {
        //flex: 1,
        height: '90%',
        width: '30%',
        backgroundColor: '#cccccc',
        //shadow
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },
    item3: {
        //flex: 1,
        height: '90%',
        width: '30%',
        backgroundColor: '#cccccc',
        //shadow
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },
    GraphBox: {
      height: '90%',
        width: '90%',
        backgroundColor: '#ececec',
        borderRadius: 5,
        //shadow
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },

});
