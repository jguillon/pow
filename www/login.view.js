var POW = POW || {};

POW.LoginView = function(submit) {
    this.submit = submit;
};

POW.LoginView.FILENAME = 'login.html';

POW.LoginView.prototype.load = function(callback) {
    var that = this;
    $('.container').load(POW.LoginView.FILENAME, function(response, status, xhr) {
        console.log("loading status: " + status);
        if (status == "error") {
            console.error("Page '" + POW.LoginView.FILENAME + "' could not load!");
        } else if (status == "success") {
            $('#login-form').submit(that.submit);
            that.hideMessage();
            callback();
        }
    });
};

POW.LoginView.prototype.showMessage = function(message, callback) {
    $('#message-box').html(message);
    $('#message-box').fadeIn(400, callback);
};

POW.LoginView.prototype.hideMessage = function(callback) {
    $('#message-box').fadeOut(400, callback);
};

POW.LoginView.prototype.getId = function () {
    return $('#id-participant').val();
};
