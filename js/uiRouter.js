// Make sure to include the `ui.router` module as a dependency.
angular.module('uiRouterSample', [])
	.controller("mainController",
	    ['$scope', 'uiRouter',
	      function ($scope, uiRouter) {
	      }]).
	service('uiRouter', ['$rootScope', function($rootScope){
		var Router, location,
			init;
		location = window.location;

		Router = function () {

		};
		Router.prototype.setState = function(state){
			this.currentState = state;
			location.hash = state;
			$rootScope.$emit("stateChanged", state);

		}
		Router.prototype.getState = function(){
			return this.currentState;
		};

		init = function(){
			if(location.hash){
				var hash = location.hash.slice(1);
				this.currentState = hash ;
				Router.prototype.setState(hash);
			};
		};

		init();
		return new Router()
	}]).
	directive('uiState', ['$rootScope', 'uiRouter', function($rootScope, uiRouter){
		return {
			link: function(scope, element, attr){
				var uiState = attr['uiState'];

				element.bind("click", function(){
					uiRouter.setState(uiState);
				});

				$rootScope.$on('stateChanged', function(event, state){
					if(attr['uiMenu'] !== undefined){
						element.removeClass("active");
						state === uiState && element.addClass("active")
					}
				})
			}
		}
	}]).
	directive('uiView', ['$rootScope', 'uiRouter', function($rootScope, uiRouter){
		return{
			link: function(scope, element, attr){
				var display = element.css("display") || "block",
					hide = function(){
					element.css({ display : 'none'})
				}
				hide();
				if(attr['uiView'] === uiRouter.currentState){
					element.css({ display : display})
				};

				$rootScope.$on('stateChanged', function(event, state){
					hide();
					if(attr['uiView'] === state){
						element.css({ display : display})
					}
				})


			}
		}
	}])

angular.module('mainModule', ['uiRouterSample'])
