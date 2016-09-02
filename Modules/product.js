var ProductApp=angular.module("ProductApp", [])
.filter('startFrom', function(){
  return function(input, start){
    start = +start;
    return input.slice(start);
  }
  });

ProductApp.directive('currentItem', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
                element.bind('load',function(e){
                var path=e.target.contentDocument.body.innerHTML;
                scope.$apply(function(){
                scope.currentItem.path=path;
                })
                })
           }
        }
    
});


ProductApp.controller("ProductCtrl",function($scope,$http){
    // $scope.detailsView="telephones";

    $scope.load=function(){
        $http.get("/productLoad").success(function(data){
        $scope.products=data;
        })
    }

    //створення нового елемента
    $scope.create=function(item){
        console.log(item);
        $http.post("/productCreate",item).success(function(item){
        $scope.products.push(item);
        $scope.setCurrentView("adminProduct");
        })
        
    }
     //оновлення елемента
    $scope.update=function(item){
        $http.post("/productUpdate",item);
        for(var i=0;i<$scope.products.length;i++){
            if($scope.products[i]._id==item._id){
                $scope.products[i]=item;
                break;
            }   
        }
       $scope.setCurrentView("adminProduct");
       }
    //знищення елемента
    $scope.delete=function(item){
        $http.post("/productDelete",item).success(function(res){
        $scope.products.splice($scope.products.indexOf(item),1);
        })
   }
    //редактування існуючого або створення нового елемента
    $scope.editOrCreate=function(item){
        $scope.currentItem=item ? angular.copy(item) : {};
        $scope.setCurrentView("editProduct");
    }

    $scope.saveEdit=function(item){
        console.log(item);
        if(angular.isDefined(item._id)){
            console.log("update");
            $scope.update(item);
        }
        else{
            console.log("create");
            $scope.create(item);
        }
    }

    $scope.cancelEdit=function(){
        $scope.currentItem={};
         $scope.setCurrentView("adminProduct");
    }

    $scope.uploadFile=function(item){
        $http.post('/uploadFile',item).success(function(item){
            console.log(item);
            $scope.currentItem.path=item;
        })
    }

    $scope.cart=[];

    $scope.addProductCart=function(item){
        var n=$scope.cart.indexOf(item);
        if(n==-1){
            item.newcount=1;
            item.newprice=item.price;
            $scope.cart.push(item);
            $scope.setCartBadge($scope.cart.length);
       }
        else{
            alert("Даний товар вже в корзині!");
        }
    }

    $scope.categories=[];

    $scope.getCategory=function(){
        $http.get("/getCategory").success(function(data){
        $scope.categories=data;
        })
    }

    $scope.selectitems=[];

    $scope.selectdistinct=function(){
        $http.get('/distinct').success(function(data){
            data.unshift("All");
            
                for (var i=0; i<data.length; i++){
                    if(data[i]=="All"){
                        var obj={name:"All", value:"All"}
                    }
                    else var obj={name:data[i], value:data[i]}
                        $scope.selectitems.push(obj);
                }; 
        });
    }

    $scope.selectName=function(){
        $http.get('/selectName').success(function(data){
            data.unshift("All");
            $scope.selectName=[];
                for (var i=0; i<data.length; i++){
                    if(data[i]=="All"){
                        var obj={name:"All", value:""}
                    }
                    else var obj={name:data[i], value:data[i]}
                        $scope.selectName.push(obj);
                }; 
        });
    }

    $scope.productDetails=function(item){
        $scope.setCurrentView("details");
        $scope.details=[];
        for(var key in item.details){
            var obj={name: key, value: item.details[key]};
            $scope.details.push(obj);
        };
    }

    // pagination
    $scope.currentPage = 0;
    $scope.itemsPerPage = 6;
    $scope.items = [];
    for(var i=0; i<25; i++){
        $scope.items.push('Product ' + i);
    }

    $scope.firstPage = function() {
        return $scope.currentPage == 0;
    }

    $scope.lastPage = function() {
        var lastPageNum = Math.ceil($scope.products.length / $scope.itemsPerPage - 1);
        return $scope.currentPage == lastPageNum;
    }

    $scope.numberOfPages = function(){
        return Math.ceil($scope.products.length / $scope.itemsPerPage);
    }

    $scope.startingItem = function() {
        return $scope.currentPage * $scope.itemsPerPage;
    }

    $scope.pageBack = function() {
        $scope.currentPage = $scope.currentPage - 1;
    }

    $scope.pageForward = function() {
        $scope.currentPage = $scope.currentPage + 1;
    }
 


    $scope.selectName();
    $scope.selectdistinct();
    $scope.load();
    $scope.getCategory();
    

})


