import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import insterOrderDetail from '@salesforce/apex/orderDetailsInsert.insterOrderDetail';
import UserStore from 'c/userStore';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import findAccounts from '@salesforce/apex/AccountSearchFormController.findAccounts';


// ProductDetailsDisplay
// PopularProductDisplay

// /productDetail
// /productDetail_c

function buildRecordUrl(recordId) {
    return `/productDetail?recordId=${recordId}`;
}

const columns = [
    { label: 'Case Id', sortable: true, fieldName: 'recordLink', type: 'url', typeAttributes: {
        label: { fieldName: 'Id' },
        target: '_self'
    }},
    { label: 'Contact Name', sortable: true, fieldName: 'Name' },
    { label: 'Subject', sortable: true, fieldName: 'category__c' },
    { label: 'Status', sortable: true, fieldName: 'count' },
    { label: 'Priority', sortable: true, fieldName: 'priority' },
    { label: 'Operation', fieldName: 'operate', type: 'button', typeAttributes: {
        label: '確認',
        variant: 'brand',
        name: 'confirm'
    }},
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
    @track sortedDirection = 'asc'
		@track sortedBy;
    @track slectedRowsKey = [];

    

    get totalPage(){
        const totalPage = Math.ceil(this.data.length / this.pageSize);
        return totalPage;
    }

		get listtotal() {
			return this.data.length;
		}

    get rowNumberOffset(){
        return (this.currentPage - 1) * this.pageSize;
    }

    get getSlectedRowsKey() {
        return [...this.slectedRowsKey]
    }


		/**
		 * 每一条数据后面加一个按钮，点一下就确认当行的数据，
		 * OK的话这条数据就不显示，不OK的报error
		 */
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'confirm':
                // 在这里处理按钮点击事件
								const isOk = Math.random() > 0.5
								new Promise((resolve, reject) => {
									this.tableLoading = true
									setTimeout(() => {
										if (isOk) resolve();
										reject('エラーが起きました。もう一度ご確認ください')
									}, 1000);
								}).then(() => {
									this.handleOptSuccess(row)
								}).catch(error => {
									this.handleOptError(error)
								})
                console.log('Button clicked for row:', JSON.stringify(row.Id));
                break;
            default:
                break;
        }
    }

		handleOptSuccess(row) {
			this.slectedRowsKey = this.slectedRowsKey.filter(item => item !== row.Id)
			const newList = this.data.filter(item => item.Id !== row.Id)
			this.handleResult(newList)
			const event = new ShowToastEvent({
				title: 'Success!',
				message: `「${row.Name}」を確認に成功しました`,
				variant: 'success',
			});
			this.dispatchEvent(event);
		}

		handleOptError(error) {
			console.log(error, 'handleOptError>>>')
			const event = new ShowToastEvent({
					title: 'Error!',
					message: error?.message || error,
					variant: 'error',
			});
			this.dispatchEvent(event);
			this.tableLoading = false
		}

		handleSort(event) {
			console.log(event.detail)
			const fieldName = event.detail.fieldName; // 获取排序字段
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'; // 切换排序方向
			this.sortedBy = fieldName; // 更新当前排序字段

			// 执行排序逻辑
			this.sortData(fieldName, this.sortDirection);
		}

		sortData(fieldName, sortDirection) {
			const dataCopy = [...this.data];
			dataCopy.sort((a, b) => {
					return sortDirection === 'asc'
							? a[fieldName] > b[fieldName] ? 1 : -1
							: a[fieldName] < b[fieldName] ? 1 : -1;
			});

			this.handleResult(dataCopy); // 更新数据
	}

    connectedCallback() {
        this.initDataRequest()
    }

		initDataRequest() {
			this.tableLoading = true
			findAccounts({
				Name: '', 
				category: 'ねつ薬'
		})
				.then(result => {
						console.log(result, 'result>>>>>>>>>>>>>>')
						this.handleResult(result)
						this.error = undefined;
				})
				.catch(error => {
						this.error = error;
						console.error(error)
				});
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

    handleOrderNameChange(event) {
        this.productMasterId = event.detail.value;
    }
    
}