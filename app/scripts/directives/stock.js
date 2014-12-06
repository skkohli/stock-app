var app = angular.module('benzingaApp');
app.directive('stockApp',['$http','$timeout',function($http,$timeout){
	return {
		restrict:'E',
		link:function(scope,elem,attrs){
			scope.error = false;
			scope.canSell = false;
			scope.stocksData = [];
			scope.i = 0;
			if(localStorage.getItem('portfolio') === null){
				scope.portfolio = {funds:100000,stocks:{}};   		  		
	       		  	//console.log('initial data null');
	    } else {
		  	scope.portfolio =JSON.parse(localStorage.getItem('portfolio')); 
		  	scope.updateStocksData(); 
		  	//scope.stocksData = scope.portfolio.stocks;
	    }

	    localStorage.setItem('portfolio',JSON.stringify(scope.portfolio));
	    scope.throwError = function(msg,setTimeout){
    		scope.error = true;
				scope.errorMsg = msg;
				if(setTimeout)
					$timeout(function(){scope.error = false;scope.errorMsg = null}, 5000);       
	    }

		},
		controller:function($scope){
			var url = "../api/get_data.php";

			$scope.searchSymbol = function(symbol) {
				var query = symbol;
				if(!symbol){
					query = $("#search").val();
				}
				if(!$scope.validateSymbol(query))
				{
					$scope.throwError('Invalid symbol',false);
					return;
				}
				$scope.showdata = false;
				$http({
					method: 'GET',
					url: url+'?q='+query
				}).success(function(data) {
					if(data.status == 'error'){
						//console.log("error there");
						$scope.throwError(data.msg,false);
						} else {
						// console.log(data);
						$scope.data = data;
						$scope.showdata = true;	
						$scope.setCanSell();
					}
	      });
	     };
			$scope.buy = function(){
				var stockQuantity = parseInt($("#stock-quantity").val());
				if(isNaN(stockQuantity)){
					$scope.throwError('No of shares should be a number',true);
					return;
				}

				if($scope.validateBuy(stockQuantity)){
					$scope.updatePortfolio(stockQuantity);
				//$scope.portfolio =JSON.parse(localStorage.getItem('portfolio'));
					$scope.portfolio.funds -= stockQuantity*($scope.data.ask);
					localStorage.setItem('portfolio',JSON.stringify($scope.portfolio));
					$scope.setCanSell();
					$scope.updateStocksData();
				} else {
					$scope.throwError('insufficient funds',true);
				}
			},
			$scope.setCanSell = function() {
				$scope.canSell =true;
	  	  // console.log($scope.portfolio);
	  	  if($scope.portfolio.stocks[$scope.data.symbol] === undefined || $scope.portfolio.stocks[$scope.data.symbol].quantity == 0)
	  	  	$scope.canSell = false;
	    },
	    $scope.validateSymbol = function(symbol){
	    	var letters = /^[0-9a-zA-Z]+$/;
	    	if(symbol.match(letters))
	    		return true;
	    	return false;
	    }
	  	$scope.sell = function() {
	  		var stockQuantity = parseInt($("#stock-quantity").val());
	  		if(isNaN(stockQuantity)) {
					$scope.throwError('No of shares should be a number',true);
					return;
				}
	  		$scope.error = false;
	  		if($scope.validateSell(stockQuantity)){
	  			$scope.portfolio.stocks[$scope.data.symbol].quantity-= stockQuantity;
	  			$scope.portfolio.funds+= (stockQuantity*$scope.data.bid);
	  			if($scope.portfolio.stocks[$scope.data.symbol].quantity == 0){
	  				delete($scope.portfolio.stocks[$scope.data.symbol]);
	  				$scope.setCanSell();
	  			}
					localStorage.setItem('portfolio',JSON.stringify($scope.portfolio));
					$scope.updateStocksData();
	   	  } else {
	   	  	$scope.throwError("insufficient shares",true);
	   	  }
	    },
	   	$scope.updateStocksData = function(){
	   		$scope.portfolio =JSON.parse(localStorage.getItem('portfolio')); 
	   		$scope.stocksData = [];
	   		$scope.i=0;
	   		for(var key in $scope.portfolio.stocks){
	   			$scope.stocksData[$scope.i] = $scope.portfolio.stocks[key];
	   			$scope.stocksData[$scope.i].symbol = key;
	   			$scope.i++;
	   		}
	   	},
	   	$scope.validateBuy = function(quantity){
		  	//var portfolio = JSON.parse(localStorage.getItem('portfolio'));
		  	if(quantity*($scope.data.ask)<=$scope.portfolio.funds)
		  		return true;
		  	return false;
	  	},
	    $scope.validateSell = function(quantity){
	    	if(quantity<=$scope.portfolio.stocks[$scope.data.symbol].quantity)
	    		return true;
	    	return false;
	    },

		  $scope.updatePortfolio = function(stockQuantity){
		  	var stocks = $scope.portfolio['stocks'];
		  	var symbol = $scope.data.symbol;
		  	if(stocks[symbol] === undefined) {
		  		var ob = {
						  			name:$scope.data.name,
						  			quantity:stockQuantity,
						  			pricePaid:$scope.data.ask
		  						 };
		  		stocks[symbol] = ob;
		  		$scope.i++;
		  		$scope.stocksData[$scope.i] = ob;
		  		$scope.stocksData[$scope.i].symbol = $scope.data.symbol;
		    } else {
		    	var data = stocks[symbol];
		    	data.quantity += stockQuantity;
		    	data.pricePaid = $scope.data.ask;
		    	stocks[symbol] = data;
		    }
		    $scope.portfolio.stocks = stocks;
		  }
		},
	  templateUrl:'views/dashboard.html',

	};
}]);
