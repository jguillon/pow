var POW = POW || {};

POW.StudyController = function() {
    this.model = new POW.StudyModel();
    this.view = new POW.StudyView();
    this.iPair = 0;
    this.task = {};
};

POW.StudyController.prototype.init = function() {
    var that = this;
    // Load words pairs
    POW.Task.load(POW.app.session.taskId, function(t) {
        that.task = t;
        // Load view
        that.view.load(function() {
            that.view.showMessage("Appuyez sur <kbd>Entrée</kbd> pour lancer la phase apprentissage.");
            POW.app.state = 'ready-to-study';
        });
    });
};

POW.StudyController.prototype.runTask = function() {
    POW.app.state = 'studying';
    var that = this;
    this.view.hideMessage(function() {
        that.displayPairOfWords();
    });
};

POW.StudyController.prototype.displayPairOfWords = function() {
    this.view.showWords(this.task.pairs[this.iPair][0],
        this.task.pairs[this.iPair][1]);
    this.view.showCount(this.iPair + 1, this.task.pairs.length);
    var that = this;
    setTimeout(function() {
        that.preparePairOfWords();
    }, POW.DISPLAY_TIME);
};

POW.StudyController.prototype.preparePairOfWords = function() {
    this.view.hideWords();
    var that = this;
    setTimeout(function() {
        that.iPair++;
        if (that.iPair < that.task.pairs.length) {
            that.displayPairOfWords();
        } else {
            console.info('All pairs have been presented.');
            that.view.showMessage("La phase d'apprentissage est terminée. <br/> Appuyez sur <kbd>Entrée</kbd> pour lancer la phase de test.");
            POW.app.state = 'done-studying';
        }
    }, POW.WAIT_TIME);
};
