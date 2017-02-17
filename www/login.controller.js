var POW = POW || {};

POW.LoginController = function() {
    // this.model = new LoginModel();
    var that = this;
    this.view = new POW.LoginView(function(event) {
        console.log("submission");
        event.preventDefault();
        that.login();
    });
};

POW.LoginController.prototype.login = function() {
    var id = this.view.getId();
    POW.Participant.load(id, function(p) {
        console.info("Participant '" + id + "' successfully logged in.")
        POW.app.participant = p;
        if (POW.app.participant.id == 'admin') {
            POW.app.controllers['admin'].init();
        } else {
            p.nextSession(function(s) {
                POW.app.session = s;
                console.info("Initialize task '" + POW.app.session.taskId + "' in condition '" + POW.app.session.condition + "'.");
                if (POW.app.session.condition == 'pre') {
                    POW.app.controllers['study'].init();
                } else if (POW.app.session.condition == 'post') {
                    POW.app.controllers['test'].init();
                }
            }, function() {
                POW.app.controllers['login'].allDone();
            });
        }
    });
};

POW.LoginController.prototype.allDone = function() {
    var that = this;
    console.log(this);
    this.view.showMessage(
        "Le sujet " + this.view.getId() + " a complété l'intégralité de ses tests.",
        function() {
            setTimeout(function() {
                that.view.hideMessage();
            }, 2000);
        }
    );
};

POW.LoginController.prototype.init = function() {
    this.view.load(function() {
        POW.app.state = 'login';
    });
};
