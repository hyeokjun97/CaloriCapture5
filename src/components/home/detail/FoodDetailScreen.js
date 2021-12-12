// 사진 촬영 후 성분 보여주는 스크린임

import React, {useEffect, useState} from "react";
import {
    SafeAreaView,
    Text,
    View,
    Button,
    StyleSheet,
    Modal,
    FlatList,
    TouchableOpacity,
    TextInput, Image,
} from "react-native";
import Slider from "react-native-sliders";
import NextFoodScreen from "../NextFoodScreen";



export default function FoodDetailScreen({route, navigation}){
    const [modalVisible, setModalVisible] = useState(false);
    const [amountUp, setAmount] = useState(false);
    const obj = JSON.stringify(route.params?.foods);
    const temp = JSON.parse(obj);
    const [candiList,setCandiList]=useState([]);

    const foodImage = (route.params.foodImage); // 사진 추출
    console.log("\n\n\n\nPHOTO PATH ==>:", foodImage, "\n\n\n\n\n");
    const foodTagsPos=temp.map((foodTag)=>{
        const x=foodTag.x;
        const y=foodTag.y;
        const w = foodTag.width;
        const h = foodTag.height;
        const foodCandi = foodTag.class_info;
        return {x,y, w, h, foodCandi};
    });
    const [selectedFood,setSelected]=useState(foodTagsPos.map(foodList => foodList.foodCandi[0]["food_name"]));
    const [amountList, setAmountList] = useState([]);

    function changeFoodItem(preFoodName, newFoodName){
        if(selectedFood.includes( newFoodName) === false) {
            const a = [...selectedFood, newFoodName]; //UseState 쓰면 안됨..
            const b = a.filter((food) => { return food !== preFoodName});
            //USE STATE 가 여기서 안됨
            const idx_old = candiList.findIndex(ans => ans === newFoodName);
            let new_candiList = candiList;
            new_candiList[0] = newFoodName;
            new_candiList[idx_old] = preFoodName;
            setSelected(b);
            setCandiList(new_candiList);
        }

    }

    return <SafeAreaView>
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView }>
                    <View style={styles.modalViewContainer}>
                    <View style={styles.modalTitle}>
                            <Text style = {styles.modalTitleText}>{candiList[0]}</Text>
                    </View>
                        <View style={styles.modalLists}>
                            <FlatList
                                keyExtractor={item => item.id}
                                data={candiList}
                                renderItem={({item}) => <TouchableOpacity
                                    style={styles.tableElem}
                                    onPress={() => {
                                        changeFoodItem(candiList[0], item);
                                    }}>
                                    <Text style = {styles.elem}>{'\u2022'}  {item}</Text>

                                </TouchableOpacity>
                                }
                            />
                            <Text style = {{ fontWeight: 'bold', color: '#5048e5', fontSize:15,}}>음식 추가</Text>
                            <View style={styles.inputView}>

                                <TextInput
                                    style={styles.textInput}
                                    placeholder = {"음식 추가"}
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible)
                                }}
                            >
                                <Text style={{fontSize: 20, color: '#5048e5', marginLeft: 250,

                                    width: "100%",}}>완료</Text>
                            </TouchableOpacity>

                </View>
                </View>
            </Modal>
            <Modal ////Second
                animationType="slide"
                transparent={true}
                visible={amountUp}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setAmount(!amountUp);
                }}
            >
                <View style={styles.centeredView }>
                    <View style={styles.modalViewContainer}>
                        <View style={styles.modalTitle}>
                            <Text style = {styles.modalTitleText}>얼마나 드셨나요?</Text>
                        </View>
                        <View style={styles.modalLists}>
                            <FlatList
                                keyExtractor={item => item.id}
                                data={selectedFood}
                                renderItem={({item}) =>
                                    <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', color: 'pink', }}>
                                        <Text style = {styles.elem} >{'\u2022'} {item}</Text>
                                        <Slider
                                            value={1}
                                            maximumValue = {2.5}

                                        />
                                    </View>
                                }
                            />
                        </View>
                        <View style={styles.modalButton}>
                            <TouchableOpacity
                                style={{ alignItems: "center",}}
                                onPress={() => {
                                    setAmount(!amountUp)
                                    navigation.navigate('NextFoodScreen');
                                    //console.log("HERE: ",navigation);
                                    //console.log("Parent: ",navigation.getParent(navigation).navigate('NextFoodScreenName'));
                                    /*상영이 함수를 여기서 호출하여 selectedFood를 인자로 넘기고, 우리는 메인 화면으로 이동*/
                                }}
                            >
                                <Text style={styles.elem}>입력 완료!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{backgroundColor:"#000", width: "90%", height:"80%", position: "absolute",//그냥 배경입니다 이곳에 사진이 옵니다.
                 }}>
                {/* 삽입될 이미지 abosolute로 중앙에 있으면됨*/}
                 <Image style={{width: 500, height:500, resizeMode:'contain', left: -55, bottom: -15,}} source={{uri: 'data:image/png;base64,' + foodImage}}/>
                {/* 오렌지 안에서 자유롭게 위치하는 태그들*/}
                <View style={{
                    position: "absolute",
                }}>
                {
                    foodTagsPos.map((pos)=> <TouchableOpacity
                            style={[styles.button, {position: "absolute",}]}
                            onPress={() => {
                                setModalVisible(true);
                                const candis=pos.foodCandi;
                                setCandiList(candis.map(candi=>{
                                    return candi.food_name;
                                }));
                            }}
                        >
                            <Text style={{
                                position: "absolute",
                                top: (pos.y/7)+20, left:(pos.x/7)+25,
                                backgroundColor: "#5048e5",
                                borderColor:'#fff',
                                borderRadius: 3,
                                borderWidth: 1,
                                fontSize: 15,
                                color: '#fff',
                            }}>
                                {pos.foodCandi[0]["food_name"]}
                                {/* 추후에 이미지에 맞춰서 x, y값 변환 */}
                            </Text>
                        </TouchableOpacity>
                    )
                }
                </View>
            </View>
            <View style={{ width:'80%', marginTop: 15, backgroundColor:'#FFF',borderRadius: 5, top: 250  }}>
                <TouchableOpacity style={{ alignItems: "center",}} onPress={ () => {setAmount(true)}}>
                    <Text style={{fontSize: 25, color: '#5048e5'}}> 완료 </Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>

};
//tag 가 있다고 가정하고


const styles = StyleSheet.create({
    container: {
        backgroundColor:"black",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: { //Modal View 가 센터로 뜨게 도와줌
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalViewContainer: {
        height: "80%",
        width: "90%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        flex: 1,
        alignContent: "baseline",
        justifyContent: 'flex-start',
        width: "100%",
        backgroundColor: '#FFF',
    },
    modalTitleText:{
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 10,
        color: "#5048e5",
    },
    modalLists:{
        flex: 8,
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: '#fdfdfd',
    },
    elem:{
        fontSize: 20,
        color: "#5048e5",

    },
    modalButton:{
        alignItems: 'center',
        justifyContent:'center',
        width: "100%",
        backgroundColor: '#fff',
        borderColor: "#5048e5",
        borderWidth: 2,
        borderRadius: 5,
        height: ' 8%',
    },

    button: {
        marginBottom: 30,

        alignItems: 'center',
        backgroundColor: '#2196F3',
        width: "100%",
    },

    textStyle: {
        color: "purple",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    inputView: {
        marginLeft: 0,
        backgroundColor: '#efefef',
        borderRadius: 5,
        width: '100%',
        height: 45,
        marginBottom:20,
        alignItems: "center",
        borderColor: "#5048e5",
        borderWidth: 2,
    },
    textInput: {
        height: 50,
        flex: 1,
        marginLeft: 10,
        color: '#5048e5',

    },
    tableElem:{
        padding: 5,
        marginTop: 5,
        alignItems: "flex-start",
        backgroundColor: '#ffffff',
        width: "100%",
        borderColor: '#5048e5',
        borderWidth: 1,
        borderRadius: 4,
    },
});
