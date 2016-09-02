var PaginationApp=angular.module("PaginationApp",[]);
PaginationApp.controller("PaginationCtrl",function($scope){
	 
	 $scope.GetPager=function(totalItems, currentPage, pageSize) {
     currentPage = currentPage || 1;
 	 pageSize = pageSize || 6;
 	 
 	 var totalPages = Math.ceil(totalItems / pageSize);
 
     var startPage=null;
     var endPage=null;
     
     if (totalPages <= 10) 
     {
     // less than 10 total pages so show all
     startPage = 1;
     endPage = totalPages;
	 } 
     else {
            // more than 10 total pages so calculate start and end pages
     if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
     } 
     else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } 
     else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
 
        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
 
        // create an array of pages to ng-repeat in the pager control
       // var pages = _.range(startPage, endPage + 1);
       var pages=[];
       for(var i=startPage;i<endPage+1;i++)
       pages.push(i);	
 
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

       

    $scope.setPage=function(page) {
        if (page < 1 || page > $scope.pager.totalPages) {
            return;
        }
 
        // get pager object from service
        $scope.pager = $scope.GetPager($scope.dummyItems.length, page);
        console.log($scope.pager);
 
        // get current page of items

        // for (var i=0; i<20; i++){
        //     $scope.items.push($scope.parent.products[i])};
        $scope.items = $scope.dummyItems.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        console.log($scope.items);
           
        
    }
       
        
    

    $scope.dummyItems = [];
    //[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]; // dummy array of items to be paged
    for(var i=0; i<=20; i++){
        $scope.dummyItems.push(i);
        console.log($scope.dummyItems);
    }
    $scope.pager = {};

 
    $scope.initController=function() {
        // initialize to page 1
       $scope.setPage(1);
    }

    $scope.initController();

    
});














