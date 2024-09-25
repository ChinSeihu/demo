public without sharing class userInfo {
    @AuraEnabled
    public static List<userMaster__c>  checkUserInfo(String username, String password){
        try {
            List<userMaster__c> infoList = Database.query('SELECT id,Name, userPassword1__c,fullName__c From userMaster__c WHERE name = :username AND userPassword1__c = :password');
            System.debug('infoList:>>>>'+ infoList);
            return infoList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static userMaster__c getUserInfo (String username){
        try {
            userMaster__c userInfo = Database.query('SELECT Name From userMaster__c WHERE name = :username LIMIT 1');
            System.debug('userInfo:>>>>'+ userInfo);
            return userInfo;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}