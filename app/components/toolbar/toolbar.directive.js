(function() {
  function envirocarToolbar() {
    return {
      restrict: "EA",
      templateUrl: "./app/components/toolbar/toolbar.directive.html",
      controller: "ToolbarCtrl",
      controllerAs: "vm"
    };
  }

  angular.module("enviroCar").directive("envirocarToolbar", envirocarToolbar);
})();
