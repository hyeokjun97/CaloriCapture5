import HistoryStorage from './HistoryStorage'


class HistoryInfo{
    constructor(userId){
        this.userId=userId;
        this.historyList=HistoryStorage.getHistory(this.userId);
    }
    addHistory(oneMeal){
        const now=new Date();
        HistoryStorage.addHistory(this.userId,oneMeal);
    }
    getMultipleFoodInfo=async(oneDayInfo)=>{
        const response =await Promise.all(oneDayInfo.map((oneMeal)=>{
            return HistoryStorage.getMultipleFoodInfo(oneMeal.foodList);
        }));
        return response;
    }
    static convertDateFormat(date) {
        return date.toLocaleDateString().replace(/\./g, '').split(' ').map((v,i)=> i > 0 && v.length < 2 ? '0' + v : v).join('-');
    }
}

module.exports=HistoryInfo;