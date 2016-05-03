$(function() {

    var $list = '.js-results-list';
    var $form = '.js-form';
    var ENDPOINT = 'https://api.spotify.com/v1/'

    $($form).on('submit', function(event) {
        event.preventDefault();
        var search = $($form).find('input').val();
        search = validateSearch(search);
        clearResults();
        requestForArtists(search);
    });

    function requestForArtists(search){
        $.ajax({
            url: ENDPOINT + 'search',
            data: 'q=' + search + '&type=artist',
            success: handleSuccess
        });
    }

    function validateSearch(search) {
        return search.split(' ').join('%20');
    }

    function clearResults() {
        $($list).empty();
    }

    function printPannels(art,index,array){
        if(art.images.length > 0){
            var html ='<div class="panel panel-default">' +
                '<div class="panel-heading">' + art.name + '</div>' +
                '<div class="panel-body" data-id="' + art.id + '">' +
                '<img class="img-responsive" src="' + art.images[0].url + '" alt="group image">' +
                '<button data-id="' + art.id + '" class="btn btn-primary js-get-albums" data-toggle="modal" data-target="#myModal">Albums</button>' +
                '</div></div>';
        };
        $($list).append(html);
    }

    function handleSuccess(data){
        data.artists.items.forEach(printPannels);
    }

    $('.js-results-list').delegate('button','click', function() {
        var id = $(this).attr('data-id');
        requestForAlbums(id);
    });

    function requestForAlbums(id){
        $.ajax({
            url: ENDPOINT + 'artists/' + id + '/albums',
            data: '',
            success: handleAlbumdata
        });
    }

    function handleAlbumdata(data) {
        var html = '';
        data.items.forEach(function(alb) {
            if(alb.album_type == "album"){
                html += '<li><a href="#" data-id="' + alb.id + '">' + alb.name + '</a></li>'
            }
        });
        $('.js-album-list').empty().append(html);
    }

    $('.modal-body').delegate('a','click', function() {
        var id = $(this).attr('data-id');
        requestForTracks(id);
    });

    function requestForTracks(id){
        $.ajax({
            url: ENDPOINT + 'albums/' + id + '/tracks',
            data: '',
            success: handleTracksData
        });
    }

    function handleTracksData(data) {
        var html = '';
        data.items.forEach(function(trc) {
            html += '<li><a href="' + trc.preview_url + '" target="_blank" data-id="' + trc.id + '">' + trc.name + '</a></li>'
        });
        $('.js-album-list').empty().append(html);
    }

});
