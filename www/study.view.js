var POW = POW || {};

POW.StudyView = function() {

};

POW.StudyView.FILENAME = 'study.html';

POW.StudyView.prototype.load = function(callback) {
    $('.container').load(POW.StudyView.FILENAME, function(response, status, xhr) {
        console.log("loading status: " + status);
        if (status == "error") {
            console.error("Page '" + POW.StudyView.FILENAME + "' could not load!");
        } else if (status == "success") {
            callback();
        }
    });
};

POW.StudyView.prototype.hideMessage = function(callback) {
    $('#message-box').fadeOut(400, callback);
};

POW.StudyView.prototype.showMessage = function(message, callback) {
    $('#message-box').html(message);
    $('#message-box').fadeIn(400, callback);
};

POW.StudyView.prototype.showWords = function(word1, word2) {
    $('#word1').text(word1);
    $('#word2').text(word2);
    $('#word1').fadeIn();
    $('#word2').fadeIn();
};

POW.StudyView.prototype.hideWords = function(word1, word2) {
    $('#word1').fadeOut();
    $('#word2').fadeOut();
};

POW.StudyView.prototype.showCount = function(i, n) {
    $('#i-pair').text(i);
    $('#n-pairs').text(n);
};
