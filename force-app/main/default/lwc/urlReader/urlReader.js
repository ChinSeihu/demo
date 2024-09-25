import { LightningElement, track, wire} from 'lwc';
import { NavigationMixin, CurrentPageReference} from "lightning/navigation";
import UserStore from  'c/userStore';

export default class UrlReader extends NavigationMixin(LightningElement) {
    @track userInfo = {}
    @track isShow = false
    @wire(CurrentPageReference) pageRef;

    async connectedCallback() {
        console.log(this.pageRef, "currentPageReference>>>>>>>>>>>:");
        const { username, password } = this?.pageRef?.state || {};

        // stateから取得したuserInfoをStoreに保存
        UserStore.username = username;
        UserStore.password = password;
        console.log(UserStore.username, "store.username1>>>>>>>>>>>:");
        console.log(UserStore.password, "store.password1.>>>>>>>>>>>:");

        const authErrorPageRef = {
            type: "comm__namedPage",
            attributes: {
                name: 'Error',
            },
        };

        console.log("connectedCallback>>>>>>>>>>>:");
        try {
            const params = { username, password };
            // 取得したuserInfoをチェック
            const userList = await UserStore.checkUserInfo(params);

            console.log(userList, 'userList>>>>>>>>');
            if (!userList.length) return this[NavigationMixin.Navigate](authErrorPageRef);

            //取得したユーザ情報を画面に表示させる
            const userItem = userList[0] || {};
            Object.assign(this.userInfo, {
                name: userItem.Name,
                fullName: userItem.fullName__c
            });
            
            this.isShow = true;
        } catch (e) {
            console.log(e?.message)
            return this[NavigationMixin.Navigate](authErrorPageRef);
        }
        //ユーザ情報チェックが問題なければホーム画面に遷移する
        this[NavigationMixin.Navigate](
            {
                type: "comm__namedPage",
                attributes: {
                    name: 'Home',
                }
            }
        );

    }
}