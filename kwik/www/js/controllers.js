angular.module('starter.controllers', [])

.controller('AnalyseCtrl', function($scope) {})

.controller('SyncCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

//.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//  $scope.chat = Chats.get($stateParams.chatId);
//})

.controller('TransactCtrl', function($scope, $timeout) {
  $scope.settings = {isIncome: true};

	$scope.user = { quantity : 0, price : 0, isPushed: false};
	var userId="Ajay01";
	var dict = new buckets.Dictionary();

	$scope.productList = [];

	firebase.database().ref().child('kwikUsers').orderByChild('uid').equalTo(userId).on("value", function(snapshot) {
		snapshot.forEach(function(data) {
			var userData = data.val().userData;
      var newKey = userData.hitCount+"_"+userData.userTag;
      if(dict.containsKey(newKey))
      {
        var l_userData = dict.get(newKey);
        l_userData.hitCount +=1;
        dict.set(l_userData);
      } else {
        dict.set(newKey, userData);
      }
		});

		var keys = dict.keys();
		keys.sort();

		$timeout(function(){
		  var len = keys.length-11 >=0 ? keys.length-11 : 0;
		  for(var i = keys.length-1; i >= len; i--){
        $scope.productList.push(dict.get(keys[i]));
      }
		}, 100);
	});


	$scope.push = function()
	{
		userId="Ajay01";
		var hitCount = 0;
		var userTag = $scope.user.tag;

		var kwikRef = firebase.database().ref('kwikUsers');
		pushData(hitCount);
	}

	function pushData(hitCount)
	{
	  $scope.productList = [];
		firebase.database().ref().child('kwikUsers').push({uid: userId, userData:{userTag:$scope.user.tag, productPrice:$scope.user.price,
		quantity:$scope.user.quantity, hitCount : 1}});

		$scope.user.quantity = 0;
    $scope.user.price = 0;
    $scope.user.tag = "";
    $scope.user.isPushed = true;
	}

	$scope.updateForm = function(usr){console.log(usr);

    if($scope.user.tag == usr.userTag){
      if($scope.user.quantity == "undefined" || $scope.user.quantity == "" || $scope.user.quantity <= 0){
        $scope.user.quantity = 1;
      } else {
        $scope.user.quantity += 1;
      }

      if($scope.user.price == "undefined" || $scope.user.price == "" || $scope.user.price <= 0){
        $scope.user.price = 0;
      } else {
        $scope.user.price += parseInt(usr.productPrice);
      }
    } else {
      $scope.user.quantity = 1;
      $scope.user.price = 0;
      $scope.user.price = parseInt(usr.productPrice);
    }
    $scope.user.tag = usr.userTag;

	}
});

