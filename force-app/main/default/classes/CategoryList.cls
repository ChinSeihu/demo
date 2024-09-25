public without sharing class CategoryList {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getCategoryList(){
        try {
            List<AggregateResult> categoryList = Database.query('SELECT category__c From productMaster__c GROUP BY category__c ');
            System.debug('categoryList:>>>>'+ categoryList);
            return categoryList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}