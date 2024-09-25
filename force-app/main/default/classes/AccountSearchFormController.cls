public without sharing class AccountSearchFormController {
    
    private static final Integer INTEGER_MAX_VALUE = 2147483647;

    @AuraEnabled(cacheable=true)
    public static List<productMaster__c> findAccounts(String Name, String category) {
        System.debug('queryStr:>>>>'+ 'Name:'+ Name + 'category:' + category);
        String strname = '%' + Name + '%';
        List<productMaster__c> accountList = Database.query('SELECT category__c,Name,id From productMaster__c WHERE name like :strname AND category__c = :category');
        System.debug('accountList:>>>>'+ accountList);

        return accountList;
    }

    // private static String createConditionSingle(
    //     String prevCond, String searchString, Boolean preLike, Boolean postLike, Decimal searchNumeric, String fieldName ) {
        
    //     String queryCond = '';
    //     if ( !String.isBlank( prevCond ) ) {
    //         queryCond = prevCond;
    //     }
    //     if ( !String.isBlank( searchString ) || searchNumeric != null ) {
    //         if ( !String.isBlank( queryCond ) ) {
    //             queryCond += ' AND ';
    //         }
    //         if ( searchNumeric != null ) {
    //             String searchValue = String.valueOf( searchNumeric );
    //             // Integer 型の最大値を超えている場合は「.0」を付加して Double 型と認識させる
    //             if ( searchNumeric > INTEGER_MAX_VALUE ) {
    //                 searchValue += '.0';
    //             }
    //             queryCond +=
    //                 '( ' + fieldName + ' = ' + searchValue + ' )';
    //         } else {
    //             String eqOrLike = ( preLike || postLike ? ' LIKE ' : ' = ' );
    //             String preLikeChar = ( preLike ? '%' : '' );
    //             String postLikeChar = ( postLike ? '%' : '' );
    //             queryCond +=
    //                 '( ' + fieldName + eqOrLike + '\'' + preLikeChar +
    //                 String.escapeSingleQuotes( searchString ) + postLikeChar + '\' )';
    //         }
    //     }
    //     return queryCond;
    // }

}