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

	$scope.user = {};
	var userId="Ajay01";
	var dict = new buckets.Dictionary();

	$scope.productList = [];

	firebase.database().ref().child('kwikUsers').orderByChild('uid').equalTo(userId).on("value", function(snapshot) {
		snapshot.forEach(function(data) {
			data.child('userDataSet').val().forEach(function(childData){
				var a = childData;
				var newKey = a.userData.hitCount+"_"+a.userData.userTag;
				if(dict.containsKey(newKey))
				{
					var l_userData = dict.get(newKey);
					l_userData.hitCount +=1;
					dict.set(l_userData);
				} else {
					dict.set(newKey, a.userData);
				}
			});
		});

		var keys = dict.keys();
		keys.sort();


		$timeout(function(){
		  for(var i=keys.length-1; i>=0; i--){
        console.log(dict.get(keys[i]).userTag);
        $scope.productList.push(dict.get(keys[i]).userTag);
      }
		}, 100);
	});


	$scope.push = function()
	{
		userId="Ajay01";
		var hitCount = 0;
		var userTag = $scope.user.tag;

		//var kwikRef = firebase.database().ref('kwikUsers/');
		firebase.database().ref().child('kwikUsers').orderByChild('uid').equalTo(userId).on("value", function(snapshot) {
			snapshot.forEach(function(data) {
				data.child('userDataSet').val().forEach(function(childData){
				var a = childData;
				if(a.userData.userTag == userTag)
					{
						hitCount = a.userData.hitCount;
						hitCount += 1;
						a.userData.hitCount += hitCount;
					}
				});
			});

			if(hitCount == 0)
			{
				pushData(hitCount);
			}
		});
	}

	function pushData(hitCount)
	{
		alert("I am in hitCount == 0");
		firebase.database().ref().child('kwikUsers').push({uid: userId, userDataSet: [{userData:{userTag:$scope.user.tag, productPrice:$scope.user.price, quantity:$scope.user.quantity, hitCount : 1}}]});
		console.log('posted message to firebase');
	}
});

