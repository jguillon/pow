var POW = POW || {};

POW.AdminController = function() {
    // this.model = new AdminModel();
    var that = this;
    this.model = new POW.AdminModel();
    this.view = new POW.AdminView(function(event) {
        event.preventDefault();
        console.log("exportation");
        that.exportAs();
    });
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

POW.AdminController.prototype.onExportError = function() {
    console.error("Exportation error !");
};

POW.AdminController.prototype.exportAs = function() {
    var that = this;
    var d = new Date();

    that.model.getExportationFileContent(function(csvContent) {
        chrome.fileSystem.chooseEntry({
            suggestedName: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "_PoW_Sauvegarde",
            type: 'saveFile',
            accepts: [{
                description: "CSV UTF-8 (délimité par des virgules)",
                extensions: ['csv']
            }]
        }, function(writableFileEntry) {
            console.log("let's write!");
            writableFileEntry.createWriter(function(writer) {
                console.log("we've got a writer!");
                writer.onerror = that.onExportError;
                writer.onwriteend = function(e) {
                    console.log('write complete');
                };
                writer.write(new Blob([csvContent], {
                    type: "text/csv"
                }));
            }, that.onExportError);
        });
    });
};
