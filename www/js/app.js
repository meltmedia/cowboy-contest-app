
// Wait for PhoneGap to connect with the device
document.addEventListener("deviceready",onDeviceReady,false);

var $imageHolder, $image, $submit;

// PhoneGap is ready to be used!
function onDeviceReady() {

    $imageHolder = $('#show-image');
    $image = $imageHolder.find('img');
    $submit = $('#submit');
    
    // Setup lookaheads for inputs
    $('input[name="first-name"]').typeahead({source:["Nick", "Luke"]});
    $('input[name="last-name"]').typeahead({source:["Crohn", "Karrys"]});
    $('input[name="twitter-username"]').typeahead({source:["nickcrohn", "lukekarrys"]});
    
    $('#take-image, #retake-image').click(function(e) {
        e.preventDefault();
        takePicture();
    });
    
    $('#use-image').click(function(e) {
        e.preventDefault();
        $imageHolder.hide();
        $submit.show();
    });
}

function takePicture() {
    $imageHolder.hide();
    navigator.camera.getPicture(
        onSuccess,
        onFail,
        {
            quality: 50, 
            destinationType: Camera.DestinationType.FILE_URI,
            allowEdit: true
        }
    );
}

function onSuccess(imageURI) {
    $image.attr('src', imageUrI);
    $imageHolder.show();
}

function onFail(message) {
    alert('Failed because: ' + message);
}