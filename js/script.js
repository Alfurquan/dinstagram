$("document").ready(function () {

    // error messages
    let urlMissingErrorMessage = '<p>I think you are forgetting something :(<p>';
    let generalErrorMessage =
        '<p>Something went wrong :( <br/><br/> \
        Either the url you provided was invalid, <br/> or you have just encountered a bug. <br/><br/> \
        Please try again! <br/> \
        Or, contact me at <span class="color-green">alfarhanzahedi@gmail.com</span><br/> \
        and help me make this application better :)</p>';

    $("#instagram-url-button").click(function () {
        $('#links').html("");
        if (!$("#instagram-url").val()) {
            $(urlMissingErrorMessage).appendTo('#links');
            return false;
        }

        // A little bit of js magic to control the "loading" animation that occurs 
        // when a user submits a instagram post page link.
        $("#loader").css("display", "inline-block");
        let loadingTime = setTimeout(checkIfDownloadLinkExists, 0);

        function checkIfDownloadLinkExists() {
            if ($("#download-link").length != 0) {
                clearTimeout(loadingTime);
                $("#loader").css("display", "none");
            }
        }

        let url = $("#instagram-url").val().trim();

        $.get('https://allorigins.me/get?method=raw&url=' + encodeURIComponent(url) +
            '&callback=?',
            function (data) {

                // match all the characters between ` <meta property="og:image" content=" ` and ` " /> `
                // i.e. get the url of the image associated with the instagram post
                // same logic applies for searching the associated video
                let imageURL = data.match(/(?<=\<meta property="og:image" content\=").*?(?=" \/\>)/);
                let videoURL = data.match(/(?<=\<meta property="og:video" content\=").*?(?=" \/\>)/);
                if(videoURL == null && imageURL == null){
                    $(generalErrorMessage).appendTo('#links');
                }
                else if (videoURL != null) {
                    $('<h2>Here you go: </h2>').appendTo('#links');
                    $('<a id="download-link" href="' + videoURL[0] + '" target="_blank" class="download-instagram-image"> DOWNLOAD <br/> (video) </a>').appendTo('#links');
                }
                else {
                    $('<h2>Here you go: </h2>').appendTo('#links');
                    $('<a id="download-link" href="' + imageURL[0] + '" target="_blank" class="download-instagram-image"> DOWNLOAD <br/> (image) </a>').appendTo('#links');
                }
            })
            .fail(function () {
                $(generalErrorMessage).appendTo('#links');
            })
            .always(function () {
                $("#loader").css("display", "none");
            })
    })
})