app.controller('GalleriesController', function($scope,$http){
  var base_url = 'http://localhost:3000/';
  $scope.data = [];
  $scope.files = [];

  function httpRequest(subDomain, methodType, inputData, datatitle, datadesc, dataimage) {
      return {
          method: methodType,
          url: base_url + subDomain,
          // isArray : true,
          headers: {
          // 'Accept' : 'application/json',
          // 'Content-Type': 'application/json; charset=UTF-8; undifinded;'
          'Content-Type': undefined;
          },
          processData: false,
  			  transformRequest: function (data) {
  			      var formData = new FormData();
              formData.append("title", datatitle);
              formData.append("description", datadesc);
              formData.append("urlimage", dataimage);
  			      return formData;
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
          $http(httpRequest('api/v1/galleries?search='+$scope.searchText+'&page='+pageNumber,'GET')).then(function(data) {
            $scope.data = data.data;
            $scope.totalItems = data.data.total;
            console.log($scope.totalItems);
          });
      }else{
        $http(httpRequest('api/v1/galleries?page='+pageNumber,'GET')).then(function(data) {
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
    $scope.form.urlimage = $scope.files[0];
    $title = $scope.form.title;
    $description = $scope.form.description;
    // $image = $scope.form.urlimage;
    $http(httpRequest('api/v1/galleries','POST',$scope.form,$title,$description,$scope.form.urlimage)).then(
      function(data) {
      //$scope.data.data.push(data);
      getResultsPage(1);
      $(".modal").modal("hide");
    });
  }

  $scope.edit = function(id){
    $http(httpRequest('api/v1/galleries/'+id+'/edit','GET')).then(function(result) {
      	$scope.form = result.data;
    });
  }

  $scope.saveEdit = function(){
    $http(httpRequest('api/v1/galleries/'+$scope.form.id,'PUT',$scope.form)).then(function(result) {
      	$(".modal").modal("hide");
        console.log($scope.data.data, $scope.form.id, result.data)
        getResultsPage($scope.data.current_page);
    });
  }

  $scope.remove = function(articles,index){
    var result = confirm("Are you sure delete this item?");
   	if (result) {
      $http(httpRequest('api/v1/galleries/'+articles.id,'DELETE')).then(function(data) {
          $scope.data.data.splice(index,1);
          console.log(data);
      });
    }
  }

  $scope.uploadedFile = function(element) {
    $scope.currentFile = element.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        $scope.image_source = event.target.result
        $scope.$apply(function($scope) {
            $scope.files = element.files;
        });
    }
    reader.readAsDataURL(element.files[0]);
  }

});
