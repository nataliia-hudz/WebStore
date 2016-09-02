var OrderApp=angular.module("OrderApp",[]);

OrderApp.controller("OrderCtrl",function($scope,$http){

    var orders=[];

    $scope.showOrders=function(){
        $http.get("/showOrders").success(function(data){
        $scope.orders=data;
        });
    };
        
    $scope.finalOrder=function(item){
         var n=$scope.orders.indexOf(item);
         console.log(n);
         $scope.orders.splice(n, 1);
         $http.post('/finalOrder', item).success(function(data){
             console.log(data);
         });
     };

     $scope.deleteOrder=function(item){
         var n=$scope.orders.indexOf(item);
         $scope.orders.splice(n, 1);
         $http.post('/deleteOrder', item).success(function(data){
             console.log(data);
         });
     };

     $scope.cancelOrder=function(subitem, item){
         var n=$scope.orders.indexOf(item);
         var m=$scope.orders[n].products.indexOf(subitem);

         if ($scope.orders[n].products.length==1){
             $scope.deleteOrder(item);
         }
         else{
             $scope.orders[n].products.splice(m,1);
             subitem.id=item._id;
             $http.post('/cancelOrderItem', subitem).success(function(data){
                 console.log('success');
             });
             $scope.showOrders();
         }
     };
     $scope.showOrders();
})
	
