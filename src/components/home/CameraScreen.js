import React from "react";
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Image,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import API from "../../api/API";
import Config from "../../api/Config";


//HERE
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodDetailScreen from "./detail/FoodDetailScreen";
import img from "../Food_Photo/meal3.jpeg";
import NextFoodScreen from "./NextFoodScreen";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});


function CameraScreenHome({route, navigation}) {

    const getFoodInfos = async (base64) => {
        const response = await API.logic.runFunction('food_detection', {
            cmd: 'food.detection.get_food_info',
            image_base64: base64
        });
        return response?.results?.food;
    };

    const takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true, uri: "file://../Food_Photo/meal3.jpeg" };
            const data = await this.camera.takePictureAsync(options);

            const base64 = data.base64;
            //실제 돌아가야할 함수.
            const foods = await getFoodInfos(base64);

           //강제로 데이터 생성함.
           /*
            const foods =[
                    {
                    "x": 40, "y": 100, "w": 100, "h": 150, "class_info": [
                        {"rank": 1, "food_name": "오렌지", "prob": 0.782753},
                        {"rank": 2, "food_name": "한라봉", "prob": 0.08359},
                    ]
                    }, {
                    "x": 250, "y": 650, "w": 120, "h": 200, "class_info": [
                        {"rank": 1, "food_name": "귤", "prob": 67.8932},
                        {"rank": 2, "food_name": "레몬", "prob": 12.3923},
                        ]
                    }
            ];
            //*/
            //console.log(foods);

            navigation.navigate('FoodDetailScreen', {
                foods: foods,
                foodImage: base64,
                otherParam: 'anything you want here',
            });
        }
    };

    return <View style={styles.container}>
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                captureAudio={false}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions={{
                    title: 'Permission to use audio recording',
                    message: 'We need your permission to use your audio',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {

                    console.log(barcodes);

                }}
            />

            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={takePicture.bind(this)} style={styles.capture}>
                    <Text style={{ fontSize: 14 }}> 촬영! </Text>
                </TouchableOpacity>
            </View>
        </View>

}



export default function CameraScreen({route, navigation}) {

    const Stack = createNativeStackNavigator();

    return <Stack.Navigator>
        <Stack.Screen name={'CameraScreenHome'} component={CameraScreenHome}/>
        <Stack.Screen name={'FoodDetailScreen'} component={FoodDetailScreen}/>
        <Stack.Screen name={'NextFoodScreen'} component={NextFoodScreen}/>
    </Stack.Navigator>

}
