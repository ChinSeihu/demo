import { LightningElement, api, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import SUPPLIED_PHONE_FIELD from '@salesforce/schema/Case.SuppliedPhone';
import SUPPLIED_EMAIL_FIELD from '@salesforce/schema/Case.SuppliedEmail';
import CONTACT_ID_FIELD from '@salesforce/schema/Case.ContactId';

const FIELDS = [
    SUPPLIED_PHONE_FIELD,
    SUPPLIED_EMAIL_FIELD,
    CONTACT_ID_FIELD
];

export default class CreateContactFromCase extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    case;

    get phone() { return getFieldValue(this.case.data, SUPPLIED_PHONE_FIELD); }
    get email() { return getFieldValue(this.case.data, SUPPLIED_EMAIL_FIELD); }

    get hasContact() {
        const contactId = getFieldValue(this.case.data, CONTACT_ID_FIELD);
        return contactId != null;
    }
    get disabled() {
        return this.hasContact || this.isSaving;
    }

    isSaving = false;
    handleSubmit(event) {
        this.isSaving = true;
    }

    handleError(event){
        this.isSaving = false;
    }

    hasMessage = false;
    createdRecordId;
    createdRecordName;

    handleSuccess(event) {
        // ケースの親として作成した取引先責任者を設定
        this.createdRecordId = event.detail.id;
        this.createdRecordName = event.detail.fields.LastName.value + event.detail.fields.FirstName.value;
        const fields = {
            "Id": this.recordId,
            "ContactId": this.createdRecordId
        };
        const recordInput = { fields };
        updateRecord(recordInput).then(() => {
            this.hasMessage = true;
        });
    }

    closeModal() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}