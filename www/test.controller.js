var POW = POW || {};

POW.TestController = function() {
    // this.model = new POW.TestModel();
    this.view = new POW.TestView();
    this.iPair = 0;
    this.task = {};
};

POW.TestController.prototype.init = function() {
    var that = this;
    // Load words pairs
    POW.Task.load(POW.app.session.taskId, function(t) {
        that.task = t;
        var indices = Array.apply(null, {
            length: that.task.pairs.length
        }).map(Number.call, Number);
        POW.app.session.pairsOrder = shuffle(indices);
        // Load view
        that.view.load(function() {
            that.view.showMessage("Des mots vous seront présentés, écrivez le mot associé le plus rapidement possible puis appuyez sur <kbd>Entrée</kbd> pour le valider.</br> Appuyez sur <kbd>Entrée</kbd> pour commencer.");
            POW.app.state = 'ready-to-test';
        });
    });
};

POW.TestController.prototype.runTask = function() {
    POW.app.state = 'testing';
    var that = this;
    this.view.hideMessage(function() {
        that.displayOneRandomWord();
    });
};

POW.TestController.prototype.displayOneRandomWord = function() {
    var newIPair = POW.app.session.pairsOrder[this.iPair];
    this.view.showWord(this.task.pairs[newIPair][0]);
    this.displayTime = Date.now();
    this.view.showCount(this.iPair + 1, this.task.pairs.length);
    POW.app.state = 'waiting-for-answer';
};

POW.TestController.prototype.displaySaveError = function(callback) {
    this.view.showModal("Erreur", "Oups...! La sauvegarde automatique ne s'est pas passée comme prévue. Voulez-vous réessayer ?", "Réessayer", callback);
};

POW.TestController.prototype.checkAnswer = function() {
    var prop = this.view.getProposal();
    var newIPair = POW.app.session.pairsOrder[this.iPair];
    var ans = this.task.pairs[newIPair][1];

    POW.app.session.times.push(Date.now() - this.displayTime);
    POW.app.session.answers.push(prop);

    if (ans == prop) {
        console.info('Correct!');
        POW.app.session.points.push(1);
        this.view.showRightAnswer(ans);
    } else if (removeDiacritics(ans) == removeDiacritics(prop)) { // Check without any accent
        console.info('Correct!');
        POW.app.session.points.push(1);
        this.view.showRightAnswer(ans);
    } else if (!POW.app.dictionary.check(prop)) {
        var suggestions = POW.app.dictionary.suggest(prop);
        console.log(suggestions);
        if (suggestions.indexOf(ans) >= 0) {
            console.info('Correct!');
            POW.app.session.points.push(1);
            this.view.showRightAnswer(ans);
        } else {
            console.warn('Wrong!');
            POW.app.session.points.push(0);
            this.view.showWrongAnswer(ans);
        }
    } else {
        console.warn('Wrong!');
        POW.app.session.points.push(0);
        this.view.showWrongAnswer(ans);
    }

    console.log(POW.app.session.times);
    console.log(POW.app.session.answers);
    console.log(POW.app.session.points);

    var that = this;
    setTimeout(function() {
        that.iPair++;
        if (that.iPair < that.task.pairs.length) {
            that.displayOneRandomWord();
        } else {
            POW.app.session.score = POW.app.session.points.reduce(function(pv, cv) { return pv + cv; }, 0); // Summation...
            console.info('All pairs have been presented.');
            that.view.showMessage("Le test est maintenant terminé.</br> Appuyez sur une touche pour quitter.");
            POW.app.state = 'done-testing';
        }
    }, POW.FEEDBACK_TIME);
};
