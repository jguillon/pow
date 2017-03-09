var POW = POW || {};

POW.AdminModel = function() {

};

POW.AdminModel.getBackupFileContent = function(callback) {
    chrome.storage.local.get('participants', function(data) {
        console.log(JSON.stringify(data));
        callback(JSON.stringify(data));
    });
};

POW.AdminModel.getExportationFileContent = function(callback) {
    POW.AdminModel.getExportationFileData(function(csvData){
        var csvContentArray = [];
        csvData.forEach(function(csvRowData, i) {
            var csvRowString = '"' + csvRowData.join('";"') + '"';
            csvContentArray.push(csvRowString);
        });
        var csvContent = csvContentArray.join('\n');
        console.log(csvContent);
        callback(csvContent);
    });
};


POW.AdminModel.getExportationFileData = function(callback) {
    chrome.storage.local.get('participants', function(data) {
        var csvData = [];
        var csvHeader = ['participant','liste','condition','date','heure','score'];
        csvData.push(csvHeader);
        $.each(data.participants, function(i, p) { // For each participant
            if(p.id != 'admin' && p.sessions) {
                $.each(p.sessions, function(i, s) { // For each session of his
                    var d = new Date(s.date);
                    var sData = [p.id, s.taskId, s.condition, d.toLocaleDateString(), d.toLocaleTimeString(), s.score];
                    csvData.push(sData);
                    console.log(sData);
                });
            }
        });
        callback(csvData);
    });
};
