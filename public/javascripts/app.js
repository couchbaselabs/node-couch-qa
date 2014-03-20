var CBQA = angular.module("CBQA", [])

CBQA.controller("QuestionListController", function ($scope, $http) {
  $http.get("/questions").success(function (data) {
    $scope.questions = data
  })

  $scope.$watch("questions", function (newValue, oldValue) {
  }, true)
})
