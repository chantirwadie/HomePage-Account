public with sharing class DataController {
     
    @AuraEnabled (cacheable=true)
    public static List<Account> retrieveAccounts(){
        return [Select Id,Name,ASAIDPRS__C, BIL_ID__C,RC__C,ICE__C,Phone, RecordType.Name, RecordTypeId FROM Account WHERE ASAIDPRS__C LIKE '219%' AND BIL_ID__C != null AND RecordType.Name IN ('Business Account', 'Prospect Entreprise', 'Client Entreprise')];
    }
}