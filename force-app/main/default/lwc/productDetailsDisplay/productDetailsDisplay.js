import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import PRODUCT_OBJECT from '@salesforce/schema/productMaster__c.category__c';
import { getRecord } from 'lightning/uiRecordApi';
import SUPPLIED_PHONE_FIELD from '@salesforce/schema/productMaster__c.category__c';
import SUPPLIED_EMAIL_FIELD from '@salesforce/schema/productMaster__c.Name';

const FIELDS = [
	SUPPLIED_PHONE_FIELD,
	SUPPLIED_EMAIL_FIELD
];


export default class ProductDetailsDisplay extends LightningElement {
	@wire(CurrentPageReference) pageRef;
	@track recordId;
	objectApiName = 'productMaster__c';
	name = PRODUCT_OBJECT

	@wire(getRecord, { recordId: '$recordId', fields: FIELDS })
	record

	set record(val) {
		console.log(record, val, 'setter>>>>>>')
		this.record = val
	}

	connectedCallback() {
		console.log(this.pageRef, 'currentPageReference>>>>>')
		console.log(PRODUCT_OBJECT, 'PRODUCT_OBJECT>>>>>>>>>')
		this.recordId = this.pageRef.state.recordId;
		console.log(this.recordId);
	}

	handleRecord() {
		console.log(this.record, 'record>>>>>>>>>>>>')
	}
}