// Make sure to include the `ui.router` module as a dependency.
angular.module('uiRouterSample', []).
	service('uiRouter', ['$rootScope', '$browser',  function($rootScope, $browser){
		var self = this,
			location = window.location,
			init;

		self.currentState = null;

		self.setState = function(state){
			var innerStates = state.split("/"),
				innerHashString = '';
			angular.forEach(innerStates, function(key, value){
				if(!value){
					innerHashString+= key;
				} else{
					innerHashString += "/"  + key
				}
				$rootScope.$emit("stateChanged", innerHashString);
			})
			self.currentState = state;
			location.hash = state;

		};

		self.getState = function(){
			return self.currentState;
		};

		self.updateState = function(){
			// parse url hash to set current state on page reloading
			if(location.hash){
				var hash = location.hash.slice(1);
				hash && self.setState(hash);
			};
		};

		$browser.onUrlChange( function(){
			self.updateState();
		});
	}]).
	directive('uiState', ['$rootScope', 'uiRouter', function($rootScope, uiRouter){
		return {
			link: function(scope, element, attr){
				var uiState = attr['uiState'],
					init;

				init = function(){
					var innerStates = uiState.split("/");

					if(!uiRouter.currentState){
						uiRouter.setState(uiState);
					};

					if(attr['uiState'].indexOf('/') !== -1){
						var innerStates = attr['uiState'].split("/");
						if(innerStates[0] === uiRouter.currentState){
							var a = innerStates[0] + "/" + innerStates[1];
							uiRouter.setState(a);
						}
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
					var innerStates = state.split("/"),
						innerUiView = attr['uiView'].split("/");
					 if(innerStates.length === innerUiView.length){
						 hide();
						 if(attr['uiView'] === state){
							 element.css({ display : display})
						 }
					 }
				})
			}
		}
	}])

angular.module('mainModule', ['uiRouterSample'])

// TO DO:
//1. remove event listeners
//2. add sub menu
