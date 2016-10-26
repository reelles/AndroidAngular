function createTableJson(tx,obj) {
        var fields = '',
            fieldsAnt = '';

        for (obj in objMenu) {
            tx.executeSql('DROP TABLE IF EXISTS ' + obj);
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
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + obj + ' (' + fields + ")");
                }
                fieldsAnt = fields;
                fields = '';
            }
        }
    };
    // tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    // tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');

}

// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: " + err);
}

// Transaction success callback
//
function successCB() {
    alert("success!");
}