var MainApp=angular.module("MainApp",["ProductApp", "CartApp", "OrderApp",]);

MainApp.directive('addClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            	element.bind('click', function() {
            	element.parent().parent().children().removeClass(attrs.addClass);
                element.parent().addClass(attrs.addClass);
            });
        }
    };
});

 MainApp.directive('ngCarousel', function() {
      return function(scope, element, attrs) {
        var el = element[0];
        var containerEl = el.querySelector("ul");
        var slidesEl = containerEl.querySelectorAll("li");
        scope.numSlides = slidesEl.length;
        scope.curSilde = 1;   
        scope.$watch('curSlide', function(num) {
          containerEl.style.left = (-1*100*(num-1)) + '%';
        });
        
        el.style.position = 'relative';
        el.style.overflow = 'hidden';

        containerEl.style.position = 'absolute';
        containerEl.style.width = (scope.numSlides*100)+'%';
        containerEl.style.listStyleType = 'none';
        containerEl.style.margin =0;
        containerEl.style.padding=0;
        containerEl.style.transition = '1s';
        
        for(var i=0; i<slidesEl.length; i++) {
          var slideEl = slidesEl[i];
          slideEl.style.display = 'inline-block';
          slideEl.style.width = (100/scope.numSlides) + '%';
        }
      };
    })

MainApp.directive('loadCurrent',function(){
return {
	restrict:"A",
	link:function(scope,element,attrs){
		scope.currentView="shopProduct";
   		}
	}
})

MainApp.filter("salaryFilter",function(){
        return function(value,idn){
            if(angular.isNumber(value)&&angular.isString(idn)){
                return value+" "+idn;
            }
            else
                return value;
        }     
})

MainApp.controller("MainCtrl",function($scope,$http){
	$scope.cartBadge=0;

	$scope.setCartBadge=function(value){
	$scope.cartBadge=value;
	}

	$scope.currentView="adminProduct";

	$scope.setCurrentView=function(name){
		$scope.currentView=name;
	}

	$scope.showAdminProduct=function(){
		$scope.currentView="adminProduct";
	}
	$scope.showAdminOrder=function(){
		$scope.currentView="adminOrder";
	}

	$scope.showShopProduct=function(){
		$scope.currentView="shopProduct";
	}
	
	$scope.showShopCart=function(){
		$scope.currentView="shopCart";
	}

	

});


