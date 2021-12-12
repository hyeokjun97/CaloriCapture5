import React,{useState,useEffect} from 'react'
import {Text, View, StyleSheet, ScrollView} from 'react-native'
import {Grid, LineChart, AreaChart, PieChart, XAxis, YAxis, ProgressCircle,} from "react-native-svg-charts";
import * as shape from "d3-shape";
import {Circle, G, Line, Rect,Svg} from "react-native-svg";
export default function DetailNutritionGraph({dateString,myDetailHistory,myMealsTotal,oneDayInfo}){
    const data_percentage = Array.from({length:101},(v,i)=>i);
    const data_time=Array.from({length:13},(v,i)=>0);
    const data_kcal=Array.from({length:25},()=>0);
    const data_fat=Array.from({length:25},()=>0);
    const data_carbon=Array.from({length:25},()=>0);
    const data_protein=Array.from({length:25},()=>0);
    const nutritionDataArr=[
        {data:data_kcal,svg:{stroke:'rgba(255, 45, 44, 1)',strokeWidth:4}},
        {data:data_fat,svg:{stroke:'rgba(255, 204, 0, 1)',strokeWidth:3}},
        {data:data_carbon,svg:{stroke:'rgba(134, 65, 244, 1)',strokeWidth:3}},
        {data:data_protein,svg:{stroke:'rgba(144, 144, 144, 1)',strokeWidth:3}},
    ];
    const dataFieldArr=[
        {name:'kcal',stroke:'rgba(255, 45, 44, 1)'},
        {name:'fat',stroke:'rgba(255, 204, 0, 1)'},
        {name:'carb',stroke:'rgba(134, 65, 244, 1)'},
        {name:'protein',stroke:'rgba(144, 144, 144, 1)'},
    ];
    const stackData=()=>{
        let i=0;
        let idx=0;
        let sum_kcal=0;
        let sum_fat=0;
        let sum_carbon=0;
        let sum_protein=0;
        for(i=0;i<25;i++){
            if(idx<oneDayInfo.length&&i==oneDayInfo[idx].time){
                if(typeof myMealsTotal[idx]["칼로리"]!=="undefined")
                    sum_kcal=sum_kcal+myMealsTotal[idx]["칼로리"];
                if(typeof myMealsTotal[idx]["지방"]!=="undefined")
                    sum_fat=sum_fat+myMealsTotal[idx]["지방"];
                if(typeof myMealsTotal[idx]["탄수화물"]!=="undefined")
                    sum_carbon=sum_carbon+myMealsTotal[idx]["탄수화물"];
                if(typeof myMealsTotal[idx]["단백질"]!=="undefined")
                    sum_protein=sum_protein+myMealsTotal[idx]["단백질"];
                idx++;
            }
            data_kcal[i]=(sum_kcal/2000)*100;
            data_fat[i]=(sum_fat/51)*100;
            data_carbon[i]=(sum_carbon/275)*100;
            data_protein[i]=(sum_protein/72)*100;
        }
    }

    if (myMealsTotal!==undefined&&Object.keys(myMealsTotal).length !== 0) {
        stackData();
    }
    const axesSvg = { fontSize: 10, fill: '#5048e5' };
    const verticalContentInset = { top: 30, bottom: 30 }
    const xAxisHeight = 20;
    return (<View style={styles.GraphBox}>
        {
            Object.keys(myMealsTotal).length == 0
                ? <View style={{height: 320, padding: 20, flexDirection: 'column', justifyContent:'center',alignItems:'center',top: 20,}}>
                    <Text style={{}}>Loading...</Text>
                </View>
                : <View style={styles.AccGraph}>
                    <Text style={styles.NutritionData}>{dateString}'s Nutrition Data</Text>
                        <YAxis
                            data={data_percentage}
                            style={{marginBottom: xAxisHeight}}
                            contentInset={verticalContentInset}
                            svg={axesSvg}
                            formatLabel={(value, index) => `${value}%`}
                        />
                        <View style={{flex: 1, marginLeft: 10}}>
                            <LineChart
                                style={{flex: 1}}
                                data={nutritionDataArr}
                                contentInset={verticalContentInset}
                                yMax={100}
                            >
                                <Grid/>
                                <HorizontalLine/>
                            </LineChart>
                            <XAxis
                                style={{marginHorizontal: -10, height: xAxisHeight}}
                                data={data_time}
                                formatLabel={(value, index) => `${2 * value}h`}
                                contentInset={{left: 10, right: 10}}
                                svg={axesSvg}
                            />

                        </View>
                    </View>
        }
            <View style={styles.DataFields}>
                <View style={[styles.Field, {borderBottomColor:'rgba(255, 45, 44, 1)'}]}>
                    <Text>kcal</Text>
                </View>
                <View style={[styles.Field,{borderBottomColor:'rgba(255, 204, 0, 1)'}]}>
                    <Text>fat</Text>
                </View>
                <View style={[styles.Field,{borderBottomColor:'rgba(134, 65, 244, 1)'}]}>
                    <Text>carbon</Text>
                </View>
                <View style={[styles.Field,{borderBottomColor:'rgba(144, 144, 144, 1)'}]}>
                    <Text>protein</Text>
                </View>
            </View>
            <View style={styles.ProgressContainer}>
                <View style={styles.ProgressInnerContainer}>
                    <ProgressNutrition
                        nutritionName={dataFieldArr[0].name}
                        dataNutrition={data_kcal}
                        Color={dataFieldArr[0].stroke}
                    />
                    <ProgressNutrition
                        nutritionName={dataFieldArr[1].name}
                        dataNutrition={data_fat}
                        Color={dataFieldArr[1].stroke}
                    />
                </View>
                <View style={styles.ProgressInnerContainer}>
                    <ProgressNutrition
                        nutritionName={dataFieldArr[2].name}
                        dataNutrition={data_carbon}
                        Color={dataFieldArr[2].stroke}
                    />
                    <ProgressNutrition
                        nutritionName={dataFieldArr[3].name}
                        dataNutrition={data_protein}
                        Color={dataFieldArr[3].stroke}
                    />
                </View>
            </View>
        </View>
    );
}
const HorizontalLine = (({ y }) => (
    <Line
        x1={ '0%' }
        x2={ '100%' }
        y1={ '135' }
        y2={ '135' }
        stroke={ 'grey' }
        strokeDasharray={ [ 6, 4 ] }
        strokeWidth={ 3 }
    />
))
function ProgressNutrition({nutritionName,dataNutrition,Color}){
    return (<View style={styles.ProgressElem}>
        <ProgressCircle
            style={ { height: 130} }
            progress={ dataNutrition[24]/100 }
            progressColor={Color}
            startAngle={ -Math.PI * 0.8 }
            endAngle={ Math.PI * 0.8 }
        >
            <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontWeight:"bold",fontSize:25}}>{nutritionName}</Text>
                <Text>{parseFloat(dataNutrition[24]).toFixed(1)}%</Text>
            </View>
        </ProgressCircle>
    </View>);
}
const styles=StyleSheet.create({
    /*Screen ELEMENTS*/
    NutritionData: {
        paddingTop: 10,
        paddingLeft:10,
        position: 'absolute',
        width: '100%',
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: '#5048e5',
    },
    GraphBox: {
        flexDirection:"column",
        justifyContent:'space-between',
        alignSelf:"baseline",
        height: 750,
        width: '97%',
        marginTop:10,
    },
    AccGraph:{
        borderRadius: 5,
        height: 320,
        padding: 15,
        flexDirection: 'row',
        top: 20,
        backgroundColor:"#fff",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },
    DataFields:{
        marginTop:10,
        justifyContent:"space-around",
        alignItems:"center",
        flexDirection: "row",
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },
    Field:{
        height:25,
        borderColor:'#fff',
        borderWidth:2,
    },
    ProgressContainer:{
      flexDirection:"column",
        justifyContent:'center',
      alignItems:"center",
        height: 320,
        width: '100%',
    },
    ProgressInnerContainer:{
        height:'50%',
        width: '100%',
        flexDirection:"row",
        justifyContent:"space-between",
    },
    ProgressElem:{
        padding:10,
        width: '49%',
        height:150,
        borderRadius:5,
        backgroundColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    }
})
