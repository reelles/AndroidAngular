var urlService = "http://192.168.70.156/ChileMatApi/api/";
var objMenu = {};



(function(){
    document.addEventListener("online", function() {
        //$cordovaPlugin.onOnline().then(success, error);
    }, false);
    document.addEventListener("deviceready", function() {
        //onOnline();
        
        navigator.splashscreen.hide();
    }, false);
});

function onOnline() {
    var mensaje = "Conectado";
    var curDevice = device.platform;
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    switch (curDevice) {
        case "browser":
        case "Mac OS X":
            bootbox.alert(mensaje + " via " + states[networkState]);
            break;
        default:
            navigator.notification.alert(mensaje + " via " + states[networkState]);
    }
}

function createTableJson(obj) {
    var fields = '',
        fieldsAnt = '',
        query = '';
    for (obj in objMenu) {
        query += 'DROP TABLE IF EXISTS ' + obj + ";";
        fieldsAnt = '';
        for (itemMenu in objMenu[obj]) {
            for (valorMenu in objMenu[obj][itemMenu]) {
                if (valorMenu.search("hashKey") == -1) {
                    fields += valorMenu + ", ";
                } else {
                    fields.remove
                }
            }
            if (fields != fieldsAnt) {
                query += 'CREATE TABLE IF NOT EXISTS ' + obj + ' (' + fields + ");";
            }
            fieldsAnt = fields;
            fields = '';
        }
    }
    return query;
};
// tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
// tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');

var restDemoApp = angular.module('testApp', ['ngCordova']);
restDemoApp.controller('TestListController', function($scope,$cordovaSQLite, restDemoService) {
    var db = $cordovaSQLite.openDB({
            name: 'DemoService.db',
            location: 'default'
        });
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
    getMenu();

    function getMenu() {
        restDemoService.getMenu().success(function(menu) {
            testList.menu = menu.Menulv1;
            objMenu = menu;
            var query = createTableJson(objMenu);
            db.transaction(function(tr) {
                tr.executeSql(query, function(tr, rs) {
                  console.log('Got upperString result: ' + rs.rows.item(0).upperString);
                });
              });

        }).error(function(error) {
            // $scope.status = 'No se puede accesder a los datos: ' + error.message;
            var message = 'No se puede accesder al Menu, Error: ' + error.message;
            bootbox.alert(message);
            //console.log($scope.status);
        });
    }
    testList.addTodo = function() {
        testList.todos.push({
            text: testList.todoText,
            done: false
        });
        testList.todoText = '';
    };
    testList.remaining = function() {
        var count = 0;
        angular.forEach(testList.todos, function(todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };
    testList.abrirModal = function(texto) {
        getModels(texto);

        function getModels() {
            restDemoService.getModels(texto).success(function(resp) {
                //console.log($scope);
                bootbox.dialog({
                    title: 'Test Rest Service',
                    message: resp + "</br> Valor de: " + texto,
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
            }).error(function(error) {
                // $scope.status = 'No se puede accesder a los datos: ' + error.message;
                var message = 'No se puede accesder a los datos: ' + error.message;
                bootbox.alert(message);
                //console.log($scope.status);
            });
        }
    };
    testList.archive = function() {
        bootbox.confirm("Guardar?", function(result) {
            if (result) {
                var oldTodos = testList.todos;
                testList.todos = [];
                angular.forEach(oldTodos, function(todo) {
                    if (!todo.done) testList.todos.push(todo);
                });
            }
        });
    };
    testList.scanCode = function() {
        cordova.plugins.barcodeScanner.scan(function(result) {
            /*alert("Codigo Escaneado\n" +
                  "Resultado: " + result.text + "\n" +
                  "Formato: " + result.format + "\n" +
                  "Candelado: " + result.cancelled);*/
            testList.code = result.text;
        }, function(error) {
            alert("Scanning failed: " + error);
        }, {
            "preferFrontCamera": false, // iOS and Android 
            "showFlipCameraButton": false, // iOS and Android 
            "prompt": "Place a barcode inside the scan area", // supported on Android only 
            "formats": "QR_CODE,PDF_417,EAN_13", // default: all but PDF_417 and RSS_EXPANDED 
            "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device 
        });
    }
});
restDemoApp.service('restDemoService', function($http, $sce) {
    var restDemoService = {};
    //var text = restDemoApp.controller.testList.text2;
    restDemoService.getModels = function(id) {
        var values = '';
        if (id != undefined) var values = 'values/?callback=JSON_CALLBACK&id=' + id;
        $sce.trustAsResourceUrl(urlService);
        return $http.jsonp(urlService + values);
    };
    restDemoService.getMenu = function() {
        var base = 'Menu/getMenu/?callback=JSON_CALLBACK&';
        $sce.trustAsResourceUrl(urlService);
        return $http.jsonp(urlService + base);
    }
    return restDemoService;
});