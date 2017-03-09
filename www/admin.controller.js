var POW = POW || {};

POW.AdminController = function() {
    // this.model = new AdminModel();
    var that = this;
    this.model = new POW.AdminModel();
    this.view = new POW.AdminView(this);
};

POW.AdminController.prototype.init = function() {
    var that = this;
    this.view.load(function() {
        chrome.storage.local.get('participants', function(data) {
            $.each(data.participants, function(i, p) { // For each participant
                if (p.id != 'admin') {
                    that.view.addParticipant(p);
                }
            });
        });
    });
};

POW.AdminController.onWriteError = function() {
    console.error("Write error !");
};

POW.AdminController.onReadSuccess = function() {
    console.info("Backup has been successfully loaded.");
};

POW.AdminController.prototype.open = function() {
    chrome.fileSystem.chooseEntry({
        type: 'openFile',
        accepts: [{
            description: "JSON",
            extensions: ['json']
        }]
    }, function(readableFileEntry) {
        if (!readableFileEntry) return;
        readableFileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onerror = POW.AdminController.onReadError;
            reader.onload = function(e) {
                var data = JSON.parse(e.target.result);
                console.log(data);
                chrome.storage.local.set({
                    'participants': data['participants']
                }, POW.AdminController.onReadSuccess);
            };
            reader.readAsText(file);
        }, POW.AdminController.onReadError);
    });
};

POW.AdminController.prototype.saveAs = function() {
    var that = this;
    var d = new Date();
    POW.AdminModel.getBackupFileContent(function(jsonContent) {
        chrome.fileSystem.chooseEntry({
            suggestedName: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "_PoW_Backup",
            type: 'saveFile',
            accepts: [{
                description: "JSON",
                extensions: ['json']
            }]
        }, function(writableFileEntry) {
            if (!writableFileEntry) return;
            console.log("let's write!");
            writableFileEntry.createWriter(function(writer) {
                console.log("we've got a writer!");
                writer.onerror = POW.AdminController.onWriteError;
                writer.onwriteend = function(e) {
                    console.log('write complete');
                };
                writer.write(new Blob([jsonContent], {
                    type: "text/json"
                }));
            }, POW.AdminController.onWriteError);
        });
    });
};

POW.AdminController.prototype.exportAs = function() {
    console.log(this);
    var d = new Date();

    POW.AdminModel.getExportationFileContent(function(csvContent) {
        chrome.fileSystem.chooseEntry({
            suggestedName: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "_PoW_Exportation",
            type: 'saveFile',
            accepts: [{
                description: "CSV UTF-8 (délimité par des virgules)",
                extensions: ['csv']
            }]
        }, function(writableFileEntry) {
            console.log("let's write!");
            writableFileEntry.createWriter(function(writer) {
                console.log("we've got a writer!");
                writer.onerror = POW.AdminController.onWriteError;
                writer.onwriteend = function(e) {
                    console.log('write complete');
                };
                writer.write(new Blob([csvContent], {
                    type: "text/csv"
                }));
            }, POW.AdminController.onWriteError);
        });
    });
};
