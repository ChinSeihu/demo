import { LightningElement } from 'lwc';
import checkUserInfo from '@salesforce/apex/userInfo.checkUserInfo';
import { NavigationMixin} from "lightning/navigation";

export default class UserStore extends NavigationMixin(LightningElement) {
    username = null;
    password = null;
    
    get username() {
        return this.username;
    }
    
    set username(name) {
        this.username = name;
    }

    get password() {
        return this.password;
    }

    set password(pass) {
        this.password = pass;
    }

    // APEX classのuserInfoチェックメソッドを呼び出す
    static async checkUserInfo(params = {}) {
        const { username, password } = params;
        if (!username || !password) return this[NavigationMixin.Navigate](authErrorPageRef);

        return await checkUserInfo(params);;
    }

}