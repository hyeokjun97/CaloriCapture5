import React,{useEffect,useState} from "react";
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View,StyleSheet} from "react-native";
import RecommendStorage from "../../model/RecommendStorage"
import User from "../../model/User"
import HistoryInfo from "../../model/History"
import HistoryStorage from "../../model/HistoryStorage"
import {createNativeStackNavigator} from "@react-navigation/native-stack";
function RecommendChooseMain({route,navigation}){
    //const dris={"칼로리":0,"탄수화물":0,"단백질":0,"지방":0};
    const mainDishes=RecommendStorage.getMainDish();
    const todayInfoList=User.getMyHistory()[`${HistoryInfo.convertDateFormat(new Date())}`];
    //const todayInfoList=User.getMyHistory()['2021-12-07'];
    const mealCounts=todayInfoList==undefined ? 0 : todayInfoList.length;
    const leftMealCount=3-mealCounts;
    const dailyRecoNut={"칼로리":2000,"지방":51,"탄수화물":275,"단백질":72};
    const [myMainReco,setMyMainReco]=useState([]);
    const [selectedReco,setSelectedReco]=useState({});
    const [dris,setRemainDris]=useState({});
    const calcMyTodayTotal=async()=>{
        let sum_kcal=0,sum_carb=0,sum_fat=0,sum_protein=0;
        const todayTotal={"탄수화물":0,"단백질":0,"지방":0,"칼로리":0};
        let i;
        if(todayInfoList!==undefined){
            for(i=0;i<mealCounts;i++){
                const foodList=todayInfoList[i].foodList;
                const mealTotal=await HistoryStorage.getTotalFoodNutritions(...foodList)
                if(mealTotal["칼로리"]!==undefined)
                    sum_kcal=sum_kcal+mealTotal["칼로리"];
                if(mealTotal["지방"]!==undefined)
                    sum_fat=sum_fat+mealTotal["지방"];
                if(mealTotal["단백질"]!==undefined)
                    sum_protein=sum_protein+mealTotal["단백질"];
                if(mealTotal["탄수화물"]!==undefined)
                    sum_carb=sum_carb+mealTotal["탄수화물"];
            }
        }
        //console.log({"탄수화물":sum_kcal,"지방":sum_fat,"단백질":sum_protein,"칼로리":sum_kcal});
        return {"탄수화물":sum_kcal,"지방":sum_fat,"단백질":sum_protein,"칼로리":sum_kcal};
    }
    const getMyMainReco=async(Candies)=>{
        const todayMyTotal=await calcMyTodayTotal();
        dris["칼로리"]=(dailyRecoNut["칼로리"]-todayMyTotal["칼로리"])/leftMealCount;
        dris["탄수화물"]=(dailyRecoNut["탄수화물"]-todayMyTotal["탄수화물"])/leftMealCount;
        dris["지방"]=(dailyRecoNut["지방"]-todayMyTotal["지방"])/leftMealCount;
        dris["단백질"]=(dailyRecoNut["단백질"]-todayMyTotal["단백질"])/leftMealCount;
        RecommendStorage.getRecommendFood(dris,...mainDishes).then((mainReco)=>{
            setRemainDris(dris);
            setMyMainReco(mainReco);
        })
    }
    useEffect(()=>{
        (async ()=>{
            await getMyMainReco();
        })();
    }, [myMainReco]);

    return (<SafeAreaView style={styles.Container}>
        <View style = {styles.header}>
            <Text style={styles.Title}>
                Select Main Dish
            </Text>
            <Text style={{fontSize:20, margin:10}}> {selectedReco["식품명"]}</Text>
        </View>
        <ScrollView style={styles.RecoListContainer}>
            {
                myMainReco.map((reco)=>{
                    return (
                        <TouchableOpacity
                            style={styles.RecoContainer}
                              onPress={()=>{
                                  setSelectedReco(reco[1]);
                              }}
                        >
                        <Text style={styles.RecoText}>{reco[1]["식품명"]}</Text>
                            <Text style={styles.RecoSmallText}>: {reco[1]["칼로리"]} </Text>
                    </TouchableOpacity>)
                })
            }
        </ScrollView>
        <View style={styles.footer}>
            <TouchableOpacity
                style={styles.SideRecommendationBtn}
                onPress={
                    ()=>{navigation.navigate('사이드디쉬',{'selectedMainReco':selectedReco,'dris':dris})}
                }
            >
                <Text style={styles.SideRecommendationTxt}>Side Dish Recommend</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>)
}
function RecommendChooseSide({route,navigation}){
    const {selectedMainReco,dris}=route?.params;
    //const leftDris=route?.dris;
    const sideDishes=RecommendStorage.getSideDish();
    const [mySideReco,setMySideReco]=useState([]);
    const [selectedReco,setSelectedReco]=useState({});
    const getMySideReco=async()=>{
        const secondDris={"칼로리":0,"탄수화물":0,"단백질":0,"지방":0};
        secondDris["칼로리"]=dris["칼로리"]-selectedMainReco["칼로리"][0];
        secondDris["단백질"]=dris["단백질"]-selectedMainReco["단백질"][0];
        secondDris["탄수화물"]=dris["탄수화물"]-selectedMainReco["탄수화물"][0];
        secondDris["지방"]=dris["지방"]-selectedMainReco["지방"][0];
        RecommendStorage.getRecommendFood(secondDris,...sideDishes).then((sideReco)=>{
            setMySideReco(sideReco);
        })
    }
    useEffect(()=>{
        (async ()=>{
            await getMySideReco();
        })();
    }, [mySideReco]);

    return (<SafeAreaView style={styles.Container}>
        <View style = {styles.header}>
            <Text style={styles.Title}>
                Select Side Dish</Text>
            <Text style={{fontSize:20, margin:10}}> {selectedReco["식품명"]}</Text>
        </View>
        <ScrollView style={styles.RecoListContainer}>
            {
                mySideReco.map((reco)=>{
                    return (
                        <TouchableOpacity
                            style={styles.RecoContainer}
                            onPress={()=>{
                                setSelectedReco(reco[1]);
                            }}
                        >
                            <Text style={styles.RecoText}>{reco[1]["식품명"]}</Text>
                            <Text style={styles.RecoSmallText}>: {reco[1]["칼로리"]} </Text>
                        </TouchableOpacity>)
                })
            }
        </ScrollView>
        <View style={styles.footer}>
            <TouchableOpacity
                style={styles.SideRecommendationBtn}
                onPress={()=>{navigation.navigate('선택완료',{"selectedMain":selectedMainReco,"selectedSide":selectedReco})}}
            >
                <Text style={styles.SideRecommendationTxt}>Done!</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>)
}
function SelectDoneScreen({route,navigation}){
    const {selectedMain,selectedSide}=route?.params;
    return (<SafeAreaView style={styles.Container}>
        <View style = {[styles.header,{flex:1}]}>
            <Text style={styles.Title}>
                Select Done</Text>
        </View>
        <View style={[styles.RecoListContainer,{flex:6}]}>
            <View style={[styles.RecoContainer,{flexDirection:"column",justifyContent:"space-around"}]}>
                <Text style={styles.RecoText}>{selectedMain["식품명"]}</Text>
                <Text style={styles.RecoSmallText}>칼로리 : {selectedMain["칼로리"]} </Text>
                <Text style={styles.RecoSmallText}>단백질 : {selectedMain["단백질"]} </Text>
                <Text style={styles.RecoSmallText}>지방 : {selectedMain["지방"]} </Text>
                <Text style={styles.RecoSmallText}>탄수화물 : {selectedMain["탄수화물"]} </Text>
            </View>
            <View style={[styles.RecoContainer,{flexDirection:"column",justifyContent:"space-around"}]}>
                <Text style={styles.RecoText}>{selectedSide["식품명"]}</Text>
                <Text style={styles.RecoSmallText}>칼로리 : {selectedSide["칼로리"]} </Text>
                <Text style={styles.RecoSmallText}>단백질 : {selectedSide["단백질"]} </Text>
                <Text style={styles.RecoSmallText}>지방 : {selectedSide["지방"]} </Text>
                <Text style={styles.RecoSmallText}>탄수화물 : {selectedSide["탄수화물"]} </Text>

            </View>
        </View>
        <View style={[styles.footer,{flex:1}]}>
            <TouchableOpacity
                style={styles.SideRecommendationBtn}
                onPress={()=>{ HistoryStorage.addTodayHistory(User.myId,[selectedMain["식품명"],selectedSide["식품명"]],[1,1])}}
            >
                <Text style={styles.SideRecommendationTxt}>Push!</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>)
}
export default function RecommendChooseScreen({route,navigation}){
    const Stack = createNativeStackNavigator();
    return(<Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name ='메인디쉬' component={RecommendChooseMain} />
        <Stack.Screen name='사이드디쉬' component={RecommendChooseSide} />
        <Stack.Screen name='선택완료' component={SelectDoneScreen} />
    </Stack.Navigator>);
}
const styles=StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems:'center',
        backgroundColor: '#ffffff',
        width: "90%",
        height:80,
    },
    Title: {
        margin:10,
        width: '100%',
        height: 60,
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 30,
        fontWeight: '700',
        color: '#5048e5',
    },
    Container:{
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems:"center",
        width:"100%",
        height:"100%",
        backgroundColor:"#fff",
    },
    RecoListContainer:{
        width:"90%",
    },
    RecoContainer:{
       width:"90%",
        height:50,
        backgroundColor: '#5048e5',
        flex:1,
        flexDirection:"row",
        justifyContent:'center',
        margin:15,
        borderRadius:15,
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },
    RecoListBox:{
        width:"100%",
        flex:1,
        justifyContent:'space-around',
    },
    RecoText:{
        fontSize: 25,
        color:'white',
        fontWeight: '800',
        fontStyle: 'italic',
        textAlign:"left",
        alignSelf:'center',
    },
    RecoSmallText:{
        fontSize: 15,
        color:'white',
        fontWeight: '600',
        fontStyle: 'italic',
        textAlign:"left",
        alignSelf:'center',
    },
    footer:{
        backgroundColor:"#fff",
        height:100,
        width:"100%",
        justifyContent:"space-around",
        alignItems:"center",
        paddingLeft:10,
        paddingTop:10,
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.35,
        shadowRadius: 9.0,
        elevation: 15,
    },
    SideRecommendationBtn: {
        backgroundColor: '#5048e5',
        borderRadius: 10,
        width: '90%',
        height: '70%',
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
    SideRecommendationTxt: {
        //textAlignVertical: 'center',
        paddingTop: '5%',
        textAlign: 'center',
        width: '80%',
        height: '80%',
        fontSize: 20,
        fontWeight: '800',
        color: '#ffffff',
    },
})
