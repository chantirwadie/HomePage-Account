import { LightningElement, wire, track } from 'lwc';
import retrieveAccounts from '@salesforce/apex/DataController.retrieveAccounts';
 
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'ASAIDPRS', fieldName: 'ASAIDPRS__c' },
    { label: 'BIL_ID__C', fieldName: 'BIL_ID__c' },
    { label: 'RC__C', fieldName: 'RC__c' },
    { label: 'ICE__C', fieldName: 'ICE__c' },
    { label: 'Record Type', fieldName: 'RecordTypeId' },

];
 
export default class accountTable extends LightningElement {
    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    totalRecords = 0; //Total no.of records
    pageSize; //No.of records to be displayed per page
    totalPages =1; //Total no.of pages
    pageNumber = 1; //Page number    
    @track data;
    @track error;
    @track columns = columns;
    @track searchString;
    @track initialRecords;
 
    @wire(retrieveAccounts)
    wiredAccount({ error, data }) {
        if (data) {
            console.log(data);
            this.data = data;
            this.initialRecords = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }
    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }
    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
 
        if (searchKey) {
            this.data = this.initialRecords;
 
            if (this.data) {
                let searchRecords = [];
 
                for (let record of this.data) {
                    let valuesArray = Object.values(record);
 
                    for (let val of valuesArray) {
                        console.log('val is ' + val);
                        let strVal = String(val);
 
                        if (strVal) {
 
                            if (strVal.toLowerCase().includes(searchKey)) {
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }
 
                console.log('Matched Accounts are ' + JSON.stringify(searchRecords));
                this.data = searchRecords;
            }
        } else {
            this.data = this.initialRecords;
        }
    }
    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }
    
    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
     paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }
}