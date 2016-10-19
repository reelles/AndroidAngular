(function () {
    document.addEventListener("online", function ()
    {
        $cordovaPlugin.onOnline().then(success, error);
    }, false);
    document.addEventListener("deviceready", function () {
        $cordovaPlugin.onOnline().then(success, error);
    }, false);

});
function onOnline() {
    var mensaje = "Conectado";
    var device = device.platform;
    switch (device) {
        case "browser":
        case "Mac OS X":
            bootbox.alert(mensaje);
            break;
        default:
            navigator.notification.alert(mensaje);
    }
}
var urlService = "https://angularjs.org/";

var restDemoApp = angular.module('testApp', ['ngCordova']);
restDemoApp.controller('TestListController', function ($scope, restDemoService) {
    var testList = this;
    testList.todos = [{
        text: 'Tarea 1',
        done: true
    }, {
        text: 'Tarea 2',
        done: true
    }, {
        text: 'Tarea 3',
        done: true
    }];

    testList.addTodo = function () {
        testList.todos.push({
            text: testList.todoText,
            done: false
        });
        testList.todoText = '';
    };
    testList.remaining = function () {
        var count = 0;
        angular.forEach(testList.todos, function (todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };
    testList.abrirModal = function (texto) {
        getModels();
        function getModels() {
            restDemoService.getModels().success(function (resp) {
                console.log($scope);    
                bootbox.dialog({
                    title: resp.name,
                    message: resp.greeting +"</br> Mensaje: " + texto,
                    buttons: {
                        'ok': {
                            className: 'btn-primary'
                        },
                        'cancel': {
                            className: 'btn-danger',
                            label: 'cerrar'
                        }
                    }
                });
            }).error(function (error) {
                // $scope.status = 'No se puede accesder a los datos: ' + error.message;
                var message = 'No se puede accesder a los datos: ' + error.message;
                bootbox.aler(message);
                //console.log($scope.status);
            });
        }
    };
    testList.archive = function () {
        bootbox.confirm("Guardar?", function (result) {
            if (result) {
                var oldTodos = testList.todos;
                testList.todos = [];
                angular.forEach(oldTodos, function (todo) {
                    if (!todo.done) testList.todos.push(todo);
                });
            }
        });
    };
});
restDemoApp.directive("templateDialogo", function ($templateRequest, $compile) {
    return {
        scope: true,
        link: function (scope, element, attrs) {
            scope.name = attrs.templateDialogo;
            $templateRequest("foo.html").then(function (html) {
                element.append($compile(html)(scope));
            });
        }
    };
});

restDemoApp.factory('restDemoService', ['$http', '$sce', function ($http, $sce) {
    var restDemoService = {};
    restDemoService.getModels = function () {
        var root = 'greet.php?callback=JSON_CALLBACK&name=Super%20Hero';
        $sce.trustAsResourceUrl(urlService);
        return $http.jsonp(urlService + root);
    };
    return restDemoService;
}]);