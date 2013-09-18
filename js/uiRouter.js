// Make sure to include the `ui.router` module as a dependency.
angular.module('uiRouterSample', []).
	service('uiRouter', ['$rootScope', function($rootScope){
		var self = this,
			location = window.location,
			init;

		self.currentState = null;

		self.setState = function(state){
			self.currentState = state;
			location.hash = state;
			$rootScope.$emit("stateChanged", state);

		};

		self.getState = function(){
			return self.currentState;
		};

		init = function(){
			// parse url hash to set current state on page reloading
			if(location.hash){
				var hash = location.hash.slice(1);
				hash && self.setState(hash);
			};
		};

		init();
	}]).
	directive('uiState', ['$rootScope', 'uiRouter', function($rootScope, uiRouter){
		return {
			link: function(scope, element, attr){
				var uiState = attr['uiState'],
					init;

				init = function(){
					if(!uiRouter.currentState){
						uiRouter.setState(uiState);
					};
					if(uiRouter.currentState === uiState){
						element.addClass("active")
					};
				};

				element.bind("click", function(){
					uiRouter.setState(uiState);
				});

				$rootScope.$on('stateChanged', function(event, state){
					element.removeClass("active");
					state === uiState && element.addClass("active");
				});

				init();
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
