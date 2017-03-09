var POW = POW || {};

POW.AdminView = function(adminController) {
    console.log(adminController);
    this.export = adminController.exportAs;
    this.save = adminController.saveAs;
    this.open = adminController.open;
};

POW.AdminView.FILENAME = 'admin.html';

POW.AdminView.prototype.load = function(callback) {
    var that = this;
    $('.container').load(POW.AdminView.FILENAME, function(response, status, xhr) {
        console.log("loading status: " + status);
        if (status == "error") {
            console.error("Page '" + POW.AdminView.FILENAME + "' could not load!");
        } else if (status == "success") {
            $('#export').click(that.export);
            $('#save').click(that.save);
            $('#open').click(that.open);
            callback();
        }
    });
};

POW.AdminView.prototype.addParticipant = function(p) {
    $('#participants-list-body').append('<tr class="participant-row" id="' + p.id + '-row"><td>' + p.id + "</td></tr>");
    var that = this;
    $('#' + p.id + '-row').click(function() {
        console.log('click on participant ' + p.id);
        $('#participants-list-body tr').removeClass('info');
        $('#' + p.id + '-row').addClass('info');
        that.showParticipantDetails(p);
    });
};

POW.AdminView.prototype.showParticipantDetails = function(p) {
    $('#participant-details-body').empty();
    if (p.sessions && !isEmpty(p.sessions)) {
        $.each(p.sessions, function(i, s) {
            var d = new Date(s.date);
            $('#participant-details-body').append(
                '<tr class="session-detail-row" id="' + s.id + '-row">' +
                '<th>' + s.taskId + '</th>' +
                '<th>' + s.condition + '</th>' +
                '<td>' + d.toLocaleDateString() + '</td>' +
                '<td>' + d.toLocaleTimeString() + '</td>' +
                '<td>' + s.score + '</td>' +
                '<td>' + Number(mean(s.times) / 1000).toFixed(3) + '</td>' +
                '</tr>');
        });
    } else {
        $('#participant-details-body').append('<tr class="session-detail-row" id="empty-row">' +
        '<th>&empty;</th>' +
        '<th>&empty;</th>' +
        '<td>&empty;</td>' +
        '<td>&empty;</td>' +
        '<td>&empty;</td>' +
        '<td>&empty;</td>' +
        '</tr>');
    }
};

function mean(elmt) {
    var sum = 0;
    for (var i = 0; i < elmt.length; i++) {
        sum += parseInt(elmt[i], 10); //don't forget to add the base
    }
    return sum / elmt.length;
};
