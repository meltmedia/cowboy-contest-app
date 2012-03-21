
(function($,undefined){
   
    /*!
     * jQuery serializeObject - v0.2 - 1/20/2010
     * http://benalman.com/projects/jquery-misc-plugins/
     * 
     * Copyright (c) 2010 "Cowboy" Ben Alman
     * Dual licensed under the MIT and GPL licenses.
     * http://benalman.com/about/license/
     */
     
    // Whereas .serializeArray() serializes a form into an array, .serializeObject()
    // serializes a form into an (arguably more useful) object.

    $.fn.serializeObject = function(){
        var obj = {};

        $.each( this.serializeArray(), function(i,o){
            var n = o.name,
                v = o.value;

            obj[n] = obj[n] === undefined ? v
                : $.isArray( obj[n] ) ? obj[n].concat( v )
                : [ obj[n], v ];
        });

        return obj;
    };


    // Wait for PhoneGap to connect with the device
    document.addEventListener("deviceready",onDeviceReady,false);

    var $submit, $uploadImage, $success, $error, $messages,
        serverPath = "http://api.notconf.com/",
        token = {token: 'HEYOITSMETHETOKEN!'};

    // PhoneGap is ready to be used!
    function onDeviceReady() {

        $success = $('#form-success');
        $error = $('#form-error');
        $submit = $('#submit');
        $uploadImage = $('#upload-image');
        $messages = $success.add($error);
        
        $('#take-image').click(function(e) {
            e.preventDefault();
            navigator.camera.getPicture(
                onSuccess,
                onFail,
                {
                    quality: 50, 
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG
                }
            );
        });
        
        $('#cowboy-form').validate({
            submitHandler: formSubmit,
            highlight: function(element, errorClass, validClass) {
                $(element).parent().addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).parent().removeClass(errorClass).addClass(validClass);
            }
        });
    }
    
    function formSubmit(form) {
        $messages.hide();
        var $this = $(form);
        $.ajax({
            url: serverPath + 'user',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify($.extend($this.serializeObject(), token)),
            success: function(data, textStatus, errorThrown) {
                var imageURI = $uploadImage.data('imageURI');
                
                var options = new FileUploadOptions();
                options.fileKey='file';
                options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                options.mimeType='image/jpeg';
                options.params = {
                    'id': data.id
                };
                options.chunkedMode = false;
     
                var ft = new FileTransfer();
                ft.upload(imageURI, serverPath + 'image', uploadSuccess, onFail, options);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                onFail(textStatus);
            }
        });
    }
    
    function uploadSuccess(response) {
        $success.show();
    }

    function onSuccess(imageURI) {
        $messages.hide();
        $uploadImage.show().attr('src', imageURI).data('imageURI', imageURI);
        $submit.removeAttr('disabled');
    }

    function onFail(message) {
        $error.text(message).show();
    }

})(jQuery);