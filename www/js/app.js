
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

    var $submit, $uploadImage, $success, $error, $messages, $form, $imageName,
        serverPath = 'http://lkarrys.local:3051/add-entry',
        token = {token: 'ZzP5jJSWknXiZ88Wl5gXJcRdK7KBWE'};

    // PhoneGap is ready to be used!
    function onDeviceReady() {
        
        $imageName = $('input[name="imageName"]');
        $success = $('#form-success');
        $error = $('#form-error');
        $submit = $('#submit');
        $uploadImage = $('#upload-image');
        $messages = $success.add($error);
        $form = $('#cowboy-form');
        
        $('#take-image').click(function(e) {
            e.preventDefault();
            navigator.camera.getPicture(
                onSuccess,
                $.noop,
                {
                    quality: 50, 
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG
                }
            );
        });
        
        $form.validate({
            ignore: '',
            submitHandler: formSubmit,
            highlight: function(element, errorClass, validClass) {
                $(element).parent().addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).parent().removeClass(errorClass).addClass(validClass);
            },
            messages: {
                imageName: 'A picture is required.',
                firstName: 'First name is required.',
                lastName: 'Last name is required.',
                twitter: 'Twitter is required.'
            }
        });
        
        $('#form-reset').click(function(e) {
            e.preventDefault();
            $form.find('input, select').each(function() {
                $(this).val('');
            });
            $uploadImage.hide().attr('src', 'img/empty.gif');
            $messages.hide();
            $('html, body').scrollTop(0);
        });
    }
    
    function formSubmit(form) {
        $messages.hide();
        
        var $this = $(form),
            imageURI = $imageName.val();
        
        $.ajax({
            url: serverPath,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify($.extend($this.serializeObject(), token)),
            processData: false,
            contentType: 'application/json',
            success: function(data, textStatus, errorThrown) {
                
                var entryId = data.entryId,
                    fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
                
                var options = new FileUploadOptions();
                options.fileKey = 'file';
                options.fileName = fileName;
                options.mimeType = 'image/jpeg';
                options.chunkedMode = true;
     
                var ft = new FileTransfer();
                ft.upload(imageURI, serverPath + '/' + entryId, uploadSuccess, onFail, options);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                onFail(textStatus);
            }
        });
    }
    
    function uploadSuccess(response) {
        $success.show();
        $('html, body').scrollTop(0);
    }

    function onSuccess(imageURI) {
        $messages.hide();
        $uploadImage.show().attr('src', imageURI);
        $imageName.val(imageURI).valid();
    }

    function onFail(message) {
        $error.text(message).show();
        $('html, body').scrollTop(0);
    }

})(jQuery);