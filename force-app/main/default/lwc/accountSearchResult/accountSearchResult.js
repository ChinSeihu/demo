import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import insterOrderDetail from '@salesforce/apex/orderDetailsInsert.insterOrderDetail';
import UserStore from 'c/userStore';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


// ProductDetailsDisplay
// PopularProductDisplay

// /productDetail
// /productDetail_c

function buildRecordUrl(recordId) {
    return `/productDetail?recordId=${recordId}`;
}

const columns = [
    { label: '商品マスタId', sortable: true, fieldName: 'recordLink', type: 'url', typeAttributes: {
        label: { fieldName: 'Id' },
        target: '_self'
    }},
    { label: '商品名', sortable: true, fieldName: 'Name' },
    { label: '商品タイプ', sortable: true, fieldName: 'category__c' },
    { label: '注文数', sortable: true, fieldName: 'count', type: 'number', editable: true },
];

export default class AccountSearchResul extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference) pageRef;

    @track data = [];
    @track columns = columns;
    @track tableDisp = false;

    @track orderName = '';
    @track orderItem = [];
    @track productMasterId;
    deliveryDate;
    @track errorMsg;
    @track isLoading;
    @track tableLoading;
    pageList = [];
    @api currentPage = 1;
    pageSize = 10;

    @track slectedRowsKey = [];

    

    get totalPage(){
        const totalPage = Math.ceil(this.data.length / this.pageSize);
        return totalPage;
    }

    get rowNumberOffset(){
        return (this.currentPage - 1) * this.pageSize;
    }

    get getSlectedRowsKey() {
        return [...this.slectedRowsKey]
    }

    connectedCallback() {
        // subscribe to searchKeyChange event
        registerListener('searchResult', this.handleResult, this);
        registerListener('searchLoading', (searching) => {
            this.tableLoading = searching;
        }, this);
    }

    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        unregisterAllListeners(this);
    }

    handleSetPageItems() {
        this.pageList = this.data.slice((this.currentPage - 1) * this.pageSize , (this.currentPage - 1) * this.pageSize + this.pageSize)
    }

    handlePrevPage() {
        if (this.currentPage == 1) return;
        this.currentPage--;
        this.handleSetPageItems();
    }
    handleNextPage() {
        if (this.currentPage == this.totalPage) return
        this.currentPage++
        this.handleSetPageItems();
    }

    handleKeydown(e) {
        if (e.key == 'Enter') this.handlePageInput(e);
    }

    handlePageInput(e) {
        console.log(e.target.value, 'handlePageInput>>>')
        const sizeVal = e?.target?.value
        if (this.totalPage < sizeVal || sizeVal < 1 || !/^[0-9]+$/g.test(sizeVal)) {
            console.log('page input check error')
            e.target.value = this.currentPage;
            return;
        }

        this.currentPage = e?.target?.value || this.currentPage;
        this.handleSetPageItems();
    }

    //選択したレコードを保存
    handleRowSelection(event) {
        if (!event?.detail?.config?.action) return;

        if (event?.detail?.config?.action == 'rowSelect') {
            return this.slectedRowsKey = this.slectedRowsKey.concat(event?.detail?.config?.value);
        }

        this.slectedRowsKey = this.slectedRowsKey.filter(item => item !== event?.detail?.config?.value);
    }

    handleResult(accountList) {
        const data = accountList.map(it => ({ ...it, count: 0, recordLink: buildRecordUrl(it.Id) }));
        this.data = data;
        this.tableDisp = true;
        this.tableLoading = false;
        this.pageList = this.data.slice(0, this.pageSize);
    }

    handleCellChange(event) {
        console.log(event, 'handleCellChange>>>>')
        event.detail.draftValues.forEach(item => {
            const findItem = this.data.find(it => item.Id === it.Id);
            findItem.count = item.count
        })
    }

    handleDateChange(e) {
        console.log(e, e.detail)
        if (e.detail.value) {
            this.deliveryDate = e.detail.value;
        }
    }

    async submit(){
        console.log('store>>>>>>', UserStore.username);
        console.log('submit>>>>>>', JSON.stringify(this.slectedRowsKey));
        console.log('deliveryDate>>>>>>>' ,this.deliveryDate);
        try {
            this.isLoading = true;
            //選択したレコードidリストパラメータとして注文作成classに渡す
            const selectedRows = this.data.filter(item => this.slectedRowsKey.includes(item.Id)).map(it => ({ id: it.Id, count: it.count }));
            console.log('orderItems>>>>\r\n', JSON.stringify(selectedRows))
            await insterOrderDetail({ 
                orderItems: JSON.stringify(selectedRows), 
                username: UserStore.username, 
                deliveryDate: new Date(this.deliveryDate).getTime()
            });
            console.log('inster order success>>>>>>>>');
            const event = new ShowToastEvent({
                title: 'Success!',
                message: '注文に成功しました',
                variant: 'success',
            });
            this.dispatchEvent(event);
            return this.isLoading = false;

        } catch(e) {
            console.log('check error>>>>>>>>>>>>>>', e.message)
            const authErrorPageRef = {
                type: "comm__namedPage",
                attributes: {
                    name: 'Error',
                },
            };
            const event = new ShowToastEvent({
                title: 'Error!',
                message: '注文に失敗しました！',
                variant: 'error',
            });
            this.dispatchEvent(event);
            // this[NavigationMixin.Navigate](authErrorPageRef);
        } 
        setTimeout(() => this.isLoading = false, 1000)
    }

    handleOrderNameChange(event) {
        this.productMasterId = event.detail.value;
    }
    
}