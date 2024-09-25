public without sharing class orderDetailsInsert {
    public class OrderItems {
        String id;
        String count;
    }
    
    @AuraEnabled()
    public static List<orderDetails__c> insterOrderDetail(String orderItems, String username, String deliveryDate) {
        System.debug('newOrder created successfully with: ' + orderItems);
        List<OrderItems> orderArray = (List<OrderItems>) JSON.deserialize(orderItems, List<OrderItems>.class);
        System.debug('orderItems:' + orderArray);
        System.debug('username:' + username);
        System.debug('deliveryDate:' + deliveryDate);
        try {
            //ユーザ情報を取得
            userMaster__c user = userInfo.getUserInfo(username);
            System.debug('user>>>>>>>>>>>>>' + user);
            List<orderDetails__c> orderList = new List<orderDetails__c>();

            //複数のレコードを作成
            for (OrderItems idItem : orderArray) {
                System.debug('idItem:' + idItem);

                orderDetails__c newOrder = new orderDetails__c();
                newOrder.productName__c = idItem.id;
                newOrder.Name = idItem.id;
                newOrder.orderQuantity__c = Integer.valueOf(idItem.count);
                newOrder.userId__c = user.Id;
                newOrder.deliveryDatetime__c = Datetime.newInstance(Long.valueOf(deliveryDate));
                orderList.add(newOrder);
            }


            System.debug('orderList:' + orderList);
            insert orderList;
            System.debug('newOrder created successfully with Ids: ' + orderList);
            return orderList;
        } catch (DmlException e) {
            System.debug('An error occurred while creating the newOrder: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while creating the newOrder: ' + e.getMessage());
        }
    }

    public String getOrderNumber() {
        orderDetails__c orderItem = [SELECT orderNum__c FROM orderDetails__c ORDER BY orderNum__c DESC LIMIT 1];
        System.debug('orderItem.orderNum__c:' + orderItem.orderNum__c);
        String orderNum = orderItem.orderNum__c.split('-')[1];
        Integer newOrderNum = Integer.valueOf(orderNum) + 1;
        System.debug('newOrderNum:' + newOrderNum);
        return String.valueOf(newOrderNum).padLeft(5, '0');
    }
}