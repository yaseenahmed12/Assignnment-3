
(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .controller('FoundItemsDirectiveController', FoundItemsDirectiveController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .constant('APIURL', 'https://davids-restaurant.herokuapp.com');

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var vm = this;
    vm.searchService = MenuSearchService;
    vm.searchStr     = '';
    vm.errorMessage  = '';
    vm.found         = [];

    vm.search = function () {
      vm.errorMessage  = '';

      if (vm.searchStr == '') {
        vm.errorMessage = 'Nothing found';
        return;
      }

      var promise = vm.searchService.getMatchedMenuItems(vm.searchStr);
      promise.then(function (response) {
        if (response !== undefined && response.length === 0) {
          vm.errorMessage = 'Nothing found';
        } else {
          vm.found = response;
        }
      });
    };

    vm.removeFromList = function (itemIndex) {
      vm.found.splice(itemIndex, 1);
    };
  }

  MenuSearchService.$inject = ['$http', 'APIURL'];
  function MenuSearchService($http, APIURL) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (APIURL + "/menu_items.json")
      })
      .then(function (result) {
        var foundItems = result.data.menu_items.filter(function (item) {
          if (item.description.indexOf(searchTerm) !== -1) {
            return item;
          }
        });

        return foundItems;
      });
    };
  }

  function FoundItemsDirective() {
    return {
      restrict: 'E',
      controller: 'FoundItemsDirectiveController',
      controllerAs: 'd',
      bindToController: true,
      templateUrl: 'found-items.html',
      scope: {
        listItems: '<foundItems',
        removeItem: '&onRemove'
      }
    };
  }

  FoundItemsDirectiveController.$inject = [];
  function FoundItemsDirectiveController() {
    var d = this;
  }
})();