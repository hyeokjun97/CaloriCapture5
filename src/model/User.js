import API from "../api/API";

class User{
    static myId;
    static myHistoryInfo;
    static getMyInfo=async ()=>{
        const me= await API.auth.getMe();
        return JSON.parse(JSON.stringify(me));
    }
    static getMyHistory(){
        return this.myHistoryInfo;
    }
    static getMyId(){
        return this.myId;
    }
    static setMyId(myId){
        this.myId=myId;
    }
    static setMyHistoryInfo(myHistoryInfo){
        this.myHistoryInfo=myHistoryInfo;
    }
}

module.exports=User