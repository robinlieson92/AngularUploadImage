app.controller('AdminController', function($scope,$http){

  $scope.pools = [];

});

app.controller('ArticlesController', function($scope,$http){

  var base_url = 'http://localhost:3000/';
  $scope.data = [];

  function httpRequest(subDomain, methodType, inputData) {
      return {
          method: methodType,
          url: base_url + subDomain,
          // isArray : true,
          headers: {
          'Accept' : 'application/json',
          'Content-Type': 'application/json; charset=UTF-8'
          },
          data: inputData
      };
  }

  $scope.libraryTemp = {};
  $scope.totalItemsTemp = {};

  $scope.totalItems = 0;
  $scope.pageChanged = function(newPage) {
    getResultsPage(newPage);
  };

  getResultsPage(1);
  function getResultsPage(pageNumber) {
      if(! $.isEmptyObject($scope.libraryTemp)){
          $http(httpRequest('api/v1/articles?search='+$scope.searchText+'&page='+pageNumber,'GET')).then(function(data) {
            $scope.data = data.data;
            $scope.totalItems = data.data.total;
            console.log($scope.totalItems);
          });
      }else{
        $http(httpRequest('api/v1/articles?page='+pageNumber,'GET')).then(function(data) {
          $scope.data = data.data;
          $scope.totalItems = data.data.total;
          console.log($scope.totalItems);
        });
      }
  }

  $scope.searchDB = function(){
      if($scope.searchText.length >= 0){
          if($.isEmptyObject($scope.libraryTemp)){
              $scope.libraryTemp = $scope.data;
              $scope.totalItemsTemp = $scope.totalItems;
              $scope.data = {};
          }
          getResultsPage(1);
      }else{
          if(! $.isEmptyObject($scope.libraryTemp)){
              $scope.data = $scope.libraryTemp ;
              $scope.totalItems = $scope.totalItemsTemp;
              $scope.libraryTemp = {};
          }
      }
  }

  $scope.saveAdd = function(){
    $http(httpRequest('api/v1/articles','POST',$scope.form)).then(
      function(data) {
      $scope.data.data.push(data);
      $(".modal").modal("hide");
    });
  }

  $scope.edit = function(id){
    $http(httpRequest('api/v1/articles/'+id+'/edit','GET')).then(function(result) {
      	$scope.form = result.data;
    });
  }

  $scope.saveEdit = function(){
    $http(httpRequest('api/v1/articles/'+$scope.form.id,'PUT',$scope.form)).then(function(result) {
      	$(".modal").modal("hide");
        console.log($scope.data.data, $scope.form.id, result.data)
        getResultsPage($scope.data.current_page);
    });
  }

  $scope.remove = function(articles,index){
    var result = confirm("Are you sure delete this item?");
   	if (result) {
      $http(httpRequest('api/v1/articles/'+articles.id,'DELETE')).then(function(data) {
          $scope.data.data.splice(index,1);
          console.log(data);
      });
    }
  }

});
