var CBQA = angular.module("CBQA", [])

CBQA.controller("QuestionListController", function ($scope, $http) {
  $http.get("/questions").success(function (data) {
    $scope.questions = data
  })

  $scope.$watch("questions", function (newValue) {
    if (newValue) {
      $http
      .post("/questions", JSON.stringify(newValue))
      .success(function (data) {
        $scope.questions = data
      })
      .error(function () {
        alert("Sorry something went wrong, please reload.")
      })
    }
  }, true)
})
