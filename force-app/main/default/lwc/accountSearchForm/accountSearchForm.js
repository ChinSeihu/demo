import { LightningElement, track, wire } from 'lwc';
import findAccounts from '@salesforce/apex/AccountSearchFormController.findAccounts';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import getCategoryList from '@salesforce/apex/CategoryList.getCategoryList';

export default class AccountSearchForm extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track acocuntName = "";
    @track orderName = "";
    @track phone = "";
    @track type = "";
    @track dunsNumber =""
    @track options = []

    @wire(getCategoryList, {})
    connectedCallback(response) {
        this.options = response?.data?.map(({ category__c }) => ({ label: category__c, value: category__c})) 
    }

    handleAccountNameChange(event) {
        this.acocuntName = event.detail.value;
        console.log(event.detail, this.acocuntName)
    }

    handlePhoneChange(event) {
        this.phone = event.detail.value;
    }

    handleTypeChange(event) {
        this.type = event.detail.value;
    }

    handleDunsNumberChange(event) {
        this.dunsNumber = event.detail.value;
    }

    handleOrderNameChange(event) {
        this.OrderName = event.detail.value;
        console.log(event.detail, this.OrderName)
    }

    handleSearch() {
        let params = {
            Name: this.acocuntName,
            category: this.type
        };
        // params.Name = this.acocuntName;
        // params.category = this.type;
        // params.type = this.type;
        // params.dunsNumber = this.dunsNumber;

        let pageRef = this.pageRef;
        fireEvent(pageRef, 'searchLoading', true);
        console.log(params, this.acocuntName, 'params>>>>>>>>>>>>>>>>>>>')
        findAccounts({
            Name: this.acocuntName, 
            category:this.type
        })
            .then(result => {
                console.log(result, 'result>>>>>>>>>>>>>>')
                fireEvent(pageRef, 'searchResult', result);
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                console.error(error)
            });
    }

}