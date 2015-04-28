/**
 * Created by Georgevik on 23/04/15.
 */
var app = angular.module('AppCC', ['ngTable', 'ui.bootstrap']);

app.controller('consultaUsuario', function($scope, $modal) {
	$scope.modalEditor = function(user){
		$scope.usuarioEditar = user;

		var modalInstance = $modal.open({
			templateUrl: 'modalUsuario',
			controller: "EditUsuarioController",
			resolve: {
				userEdit : function(){
					return $scope.usuarioEditar;
				}
			}

		});

		modalInstance.result.then(function(){
			console.log("assadasddf");
		});
	}

});

/**
 * scope -> contiene todos los nodos del controler
 * modalInstance -> controla el panel modal creado
 * http -> nos sirve para hacer una comunicacion http
 * userEdit -> contiene el usuario a editar previamente enviado desde el controler "consultaUsuario"
 */
app.controller("EditUsuarioController", function($scope, $modalInstance, $http, userEdit){
	// oculta la venta
	$scope.cancel = function(){
		$modalInstance.dismiss("cancel");
	};

	//Rellena el modelo usuarioEditar en el scope
	$scope.usuarioEditar = userEdit;

	$scope.editarUsuario = function(){
		$http.post('/modalUsuario', {
						idEdit:$scope.usuarioEditar._id,
						usuarioEdit:$scope.usuarioEditar.usuario,
						emailEdit:$scope.usuarioEditar.email,
						passwordEdit:$scope.usuarioEditar.password
					}
			).success(function(data, status, headers, config) {
				console.log("asdf");
				$modalInstance.close();
			});
	}
});