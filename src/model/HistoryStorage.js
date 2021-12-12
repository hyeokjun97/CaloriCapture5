const fs =require("react-native-fs");
import API from "../api/API";
import HistoryInfo from "../model/History"
class HistoryStorage{
    static #history={
        "aAMRxEJVuXdUQwPSkxU2ME": {
            "2021-12-07": [
                {"foodList": ["오곡밥","불고기"], "amountList": [1.0,1.0],"totalKcal":794,"time":11},
                {"foodList": ["칼국수"], "amountList": [1.0],"totalKcal":420,"time":15},
                {"foodList": ["닭볶음탕"], "amountList": [1.0],"totalKcal":230,"time":22},
            ],
            "2021-12-08": [
                {"foodList": ["삼계탕","오곡밥"], "amountList": [1.0,1.0],"totalKcal":762,"time":8},
                {"foodList":["김치볶음밥"], "amountList":[1.0,],"totalKcal":446,"time":13},
                {"foodList": ["닭볶음탕"], "amountList": [1.0],"totalKcal":230,"time":20},
            ],
            "2021-12-09": [
                {"foodList":["닭볶음탕",], "amountList":[1.0],"totalKcal":230,"time":14},
                {"foodList":["육개장","현미밥"], "amountList":[1.0],"totalKcal":486,"time":20}
            ],
            "2021-12-10": [
                {"foodList":["카레 덮밥",], "amountList":[1.0,],"totalKcal":544,"time":14},
                {"foodList":["피자",], "amountList":[0.5,],"totalKcal":242,"time":17}
            ],
            "2021-12-11": [
                {"foodList":["김치볶음밥"], "amountList":[1.0,],"totalKcal":446,"time":13}
            ],
            "2021-12-12": [
                {"foodList":["잔치국수","배추김치"], "amountList":[1.0,1.0],"totalKcal":455,"time":17},
                {"foodList":["양념치킨"], "amountList":[0.5],"totalKcal":129,"time":23}
            ],
            "2021-12-13": [
                {"foodList":["된장찌개","오곡밥"], "amountList":[1.0,1.0],"totalKcal":479,"time":13}
            ],
        },
    }//key 값은 userid
    static getHistory=(userId)=>{
        let historyList=this.#history[`${userId}`];
        if(historyList==undefined){
            this.#history[`${userId}`] = {};
            historyList=this.#history[`${userId}`];
        }
        return historyList;
    }
    static addTodayHistory=async(userId,foodList,amountList)=>{
        const dateString=new Date().toLocaleDateString().replace(/\./g, '').split(' ').map((v,i)=> i > 0 && v.length < 2 ? '0' + v : v).join('-');
        console.log(dateString);
        const dateObj=new Date();
        const nowTime=dateObj.getHours();
        console.log("id!",userId);
        console.log("time:",nowTime);
        const totalNutrition=await HistoryStorage.getTotalFoodNutritions(...foodList);
        const totalKcal=totalNutrition["칼로리"];
        const newMeal={
                [dateString]: [{"foodList":{foodList},"amountList":{amountList},"totalKcal":{totalKcal},"time":{nowTime}}],
        }
        console.log("newmeal:",newMeal);
        this.#history[`${userId}`].push(newMeal);
    }
    static getSingleFoodInfo=async (foodName)=>{
        const response=await API.logic.runFunction("DB_and_reco_API",
            {
                "cmd":"food.db_find_one",
                "query":foodName
            });
        return response
    }
    static getMultipleFoodInfo=async(...foodNames)=>{
        const response= await API.logic.runFunction("DB_and_reco_API",
            {
                "cmd":"food.db_find_many",
                "query":[...foodNames]
        });
        return response;
    }
    static getTotalFoodNutritions=async(...foodNames)=>{
        return API.logic.runFunction("DB_and_reco_API",
            {
                "cmd":"food.foods_nutriiton",
                "query":[...foodNames]
            }).then((response)=>{
                return response;
            }).catch(console.log)
    }
}

module.exports=HistoryStorage;