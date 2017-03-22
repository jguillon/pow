var POW = POW || {};

POW.TestView = function() {

};

POW.TestView.FILENAME = 'test.html';

POW.TestView.prototype.load = function(callback) {
    $('.container').load(POW.TestView.FILENAME, function(response, status, xhr) {
        console.log("loading status: " + status);
        if (status == "error") {
            console.error("Page '" + POW.TestView.FILENAME + "' could not load!");
        } else if (status == "success") {
            callback();
        }
    });
};

POW.TestView.prototype.hideMessage = function(callback) {
    $('#message-box').fadeOut(400, callback);
};

POW.TestView.prototype.showModal = function(title, message, confirm, callback) {
    $("#test-modal-title").html(title);
    $("#test-modal-body").html(message);
    $("#test-modal-confirm").html(confirm);
    $("#test-modal-confirm").on('click', callback);
    $("#test-modal").modal('show');
};

POW.TestView.prototype.showMessage = function(message, callback) {
    $('#word1').hide();
    $('#proposal').hide();
    $('#message-box').html(message);
    $('#message-box').fadeIn(400, callback);
};

POW.TestView.prototype.showWord = function(word1, word2) {
    $('#word1').text(word1);
    $('#word1').show();
    $('#proposal').show();
    $('#proposal').focus();
};

POW.TestView.prototype.showRightAnswer = function(ans) {
    $('#proposal').hide();
    $('#solution').text(ans).addClass("right").removeClass("wrong").show();
    setTimeout(function() {
        $('#solution').hide();
        $('#proposal').val("");
        $('#proposal').show();
        $('#proposal').focus();
    }, POW.FEEDBACK_TIME);
};

POW.TestView.prototype.showWrongAnswer = function(ans) {
    $('#proposal').hide();
    $('#solution').text(ans).addClass("wrong").removeClass("right").show();
    setTimeout(function() {
        $('#solution').hide();
        $('#proposal').val("");
        $('#proposal').show();
        $('#proposal').focus();
    }, POW.FEEDBACK_TIME);
};

POW.TestView.prototype.getProposal = function() {
    return $('#proposal').val();
};

POW.TestView.prototype.showCount = function(i, n) {
    $('#i-pair').text(i);
    $('#n-pairs').text(n);
};
