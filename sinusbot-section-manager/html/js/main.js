var channelManagerInstance;

function createChannelSection(channelSettings, instanceID) {
    $.ajax({
        url: '/api/v1/bot/i/' + instanceID + '/event/createChannelSection',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + window.localStorage.token
        },
        data: JSON.stringify(channelSettings)
    });
}

$(document).ready(function () {
    var instanceList = $('#ddInstanceList');
    $.ajax({
        url: '/api/v1/bot/instances',
        headers: {'Authorization': 'bearer ' + window.localStorage.token},
        statusCode: {
            401: function () {
                swal({
                    title: 'Error',
                    text: "In order for you to access this you have to be logged in.",
                    type: 'warning',
                    confirmButtonColor: '#D9230F',
                    confirmButtonText: 'Webinterface',
                    closeOnConfirm: false
                }).then(function () {
                    window.location = getRootUrl();
                });
            }
        }
    }).done(function (data) {
        data = data.filter(sectionChannel => sectionChannel.backend === "ts3")
            .sort(dynamicSort('name'));
        if (window.localStorage.instanceId != undefined) {
            if (window.localStorage.instanceId.length == 36) {
                data.forEach(function (instance) {
                    if (instance.uuid == window.localStorage.instanceId) {
                        channelManagerInstance = instance;
                        $("#instanceDdl").html('Managing Instance: ' + (instance.name ? instance.name : instance.nick));
                    }
                });
            }
        }
        data.forEach(function (instance) {
            $('<li/>').appendTo(instanceList).html('<a href="#">' + (instance.name ? instance.name : instance.nick) + '</a>')
                .click(function () {
                    console.log('OnClickInstance: ' + instance.uuid);
                });
        });
        $('.instanceDdl > li > a').click(function () {
            $("#instanceDdl").html('Managing Instance: ' + $(this).text());
        });
    });

    $('#testButton').click(function () {
        createChannelSection({channel: "Xd"}, channelManagerInstance.uuid)
    });
});

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}