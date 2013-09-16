// Make sure to include the `ui.router` module as a dependency.
angular.module('uiRouterSample', [])
	.controller("mainController",
	    ['$scope', '$location', 'uiRouter',
	      function ($scope, $location, uiRouter) {
	      }]).
	service('uiRouter', ['$rootScope', '$location', function($rootScope, $location){
		var Router = function () {
			this.currentState = 'settings';
		};
		Router.prototype.setState = function(state){
			location.hash = state;
			$rootScope.$emit("stateChanged", state);

		}
		Router.prototype.getState = function(){
			return this.currentState;

		}
		return new Router()
	}]).
	directive('uiState', ['$location', 'uiRouter', function($location, uiRouter){
		return {
			link: function(scope, element, attr){
				angular.element(element).bind("click", function(){
					var state = attr['uiState'];
					uiRouter.setState(state);
				})
			}
		}
	}]).
	directive('uiView', ['$rootScope', 'uiRouter', function($rootScope, uiRouter){
		return {
			link: function(scope, element, attr){
				scope.isCurrentState =
				$rootScope.$on('stateChanged', function(event, state){
				   if(attr['uiView'] === state){

				   }
				})
			}
		}
	}])

angular.module('mainModule', ['uiRouterSample'])
