var ENDPOINT = 'https://api.spotify.com/v1/search';
var END_ALBUM = 'https://api.spotify.com/v1/';
var songList = {};
var albums = {};

$(function() {

    $('.js-search').on('submit', function(event) {
        event.preventDefault();
        var search = $('.js-search').find('input').val();
        $.ajax({
            url: ENDPOINT,
            data: 'q=' + search + '&type=track',
            success: updateSongDetails
        });
    });

    function updateSongDetails(response){
        songList = response.tracks.items;
        $('.js-results-titles').empty();
        fillSelectResult(response);
        var track = response.tracks.items[0];
        var imgSrc = track.album.images[0].url;
        var author = track.artists[0].name;
        var title = track.name;
        var preview = track.preview_url;
        console.log(response);
        $('.cover img').prop('src', imgSrc);
        $('.author').text(author);
        $('.title').text(title);
        $('.js-player').prop('src', preview);
    }

    function fillSelectResult(response){
        response.tracks.items.forEach(function(track, index) {
            var trackClass = 'js-track' + index;
            var html = '<div class="' + trackClass + ' tracks invisible"><p>' +
                track.name + '<br><strong><a class="js-artist" href="">' + track.artists[0].name +
                '</a></strong></p></div>';
            $('.js-results-titles').append(html);
            $('.js-prev').removeClass('invisible');
            $('.js-next').removeClass('invisible');
            $('.js-results').addClass('not-empty');
        });
        $('.js-track0').removeClass('invisible').addClass('visible');
    }

    $('.search').delegate('.js-artist', 'click', function(event) {
        event.preventDefault();
        $('.js-artist-info').slideToggle();
        var tracks = $('.js-results').find('div').slice(2);
        var visible = $('.visible');
        var current = tracks.index(visible);
        if(songList[current].artists[0].name != $('.js-ai-name').text()){
            getArtsistInfo(current);
        }
    });

    function getArtsistInfo(current) {
        $.ajax({
            url: ENDPOINT,
            data: 'q=' + songList[current].artists[0].name + '&type=artist',
            success: function(response) {
                console.log(response);
                var name = response.artists.items[0].name;
                var imgSrc = response.artists.items[0].images[0].url;
                var genres = response.artists.items[0].genres.join(', ');
                var followers = response.artists.items[0].followers.total;
                var popularity = response.artists.items[0].popularity;
                $('.js-ai-name').text(name);
                $('.js-ai-pic').prop('src', imgSrc);
                $('.js-ai-genres').text(genres);
                $('.js-ai-followers').text(followers);
                $('.js-ai-popularity').text(popularity);
            }
        });
    }

    $('.js-next').on('click', function() {
        var tracks = $('.js-results').find('div').slice(2);
        var visible = $('.visible');
        var current = tracks.index(visible);
        $(tracks[current]).removeClass('visible').addClass('invisible');
        if(current == (tracks.length - 1)) {
            $(tracks[0]).removeClass('invisible').addClass('visible');
            current = 0;
        } else {
            $(tracks[current].nextSibling).removeClass('invisible').addClass('visible');
            current += 1;
        }
        loadNewSong(current);
        if(songList[current].artists[0].name != $('.js-ai-name').text()){
            getArtsistInfo(current);
            if($('.artist-info-box').hasClass('invisible')){
                $('.artist-info-box').removeClass('invisible');
            }
            if(!$('.available-albums-list').hasClass('invisible')){
                $('.available-albums-list').addClass('invisible');
            }
            if(!$('.album-info-box').hasClass('invisible')){
                $('.album-info-box').addClass('invisible');
            }
        }
    });

    $('.js-prev').on('click', function() {
        var tracks = $('.js-results').find('div').slice(2);
        var visible = $('.visible');
        var current = tracks.index(visible);
        $(tracks[current]).removeClass('visible').addClass('invisible');
        if(current == 0) {
            $(tracks[(tracks.length - 1)]).removeClass('invisible').addClass('visible');
            current = tracks.length - 1;
        } else {
            $(tracks[current].previousSibling).removeClass('invisible').addClass('visible');
            current -= 1;
        }
        loadNewSong(current);
        if(songList[current].artists[0].name != $('.js-ai-name').text()){
            getArtsistInfo(current);
            if($('.artist-info-box').hasClass('invisible')){
                $('.artist-info-box').removeClass('invisible');
            }
            if(!$('.available-albums-list').hasClass('invisible')){
                $('.available-albums-list').addClass('invisible');
            }
            if(!$('.album-info-box').hasClass('invisible')){
                $('.album-info-box').addClass('invisible');
            }
        }
    });

    function loadNewSong(num) {
        var track = songList[num];
        var imgSrc = track.album.images[0].url;
        var author = track.artists[0].name;
        var title = track.name;
        var preview = track.preview_url;
        $('.cover img').prop('src', imgSrc);
        $('.author').text(author);
        $('.title').text(title);
        $('.js-player').prop('src', preview);
        $('.seekbar progress').prop('value', 0);
        $('.js-play').removeClass('playing');
    }

    $('.js-play').on('click', function() {
        $('.js-play').toggleClass('playing');
        if($('.js-play').hasClass('playing')) {
            $('.js-player').trigger('play');
        } else {
            $('.js-player').trigger('pause');
        }
    });

    $('.js-player').on('timeupdate', function() {
        var currentTime = Math.round($('.js-player').prop('currentTime'));
        $('.seekbar progress').prop('value', currentTime);
    });

    $('.js-view-albums').on('click', function(event) {
        event.preventDefault();
        $('.available-albums-list').toggleClass('invisible');
        $('.artist-info-box').toggleClass('invisible');
        getArtistAlbums();
    });

    function getArtistAlbums() {
        var tracks = $('.js-results').find('div').slice(2);
        var visible = $('.visible');
        var current = tracks.index(visible);
        var artistId = songList[current].artists[0].id;
        $('.js-av-al-list').empty();
        $.ajax({
            url: END_ALBUM + 'artists/' + artistId + '/albums',
            data: '',
            success: getAlbumInfo
        });
    }

    function getAlbumInfo(response) {
        albums = response;
        albums.items.forEach(function(album) {
            if(album.album_type == "album") {
                var html = '<li><a href="#" class="js-album-select" data-id="' + album.id + '">' +
                    album.name +
                    '</a></li>';
                $('.js-av-al-list').append(html);
            }
        });
    }

    $('.back-to-info').on('click', function(event) {
        event.preventDefault();
        $('.available-albums-list').toggleClass('invisible');
        $('.artist-info-box').toggleClass('invisible');
    });

    $('.js-av-al-list').delegate('.js-album-select', 'click', function(event) {
        event.preventDefault();
        console.log(event.currentTarget);
        var album = $('.js-album-select').index(event.currentTarget);
        var id = event.currentTarget.getAttribute('data-id');
        $.ajax({
            url: END_ALBUM + 'albums/' + id + '/tracks',
            data: '',
            success: function(response) {
                $('.js-track-list').empty();
                console.log(response);
                console.log('album: ' + album);
                console.log(albums.items[album]);
                $('.js-ali-name').text(albums.items[album].name);
                $('.js-ali-pic').prop('src', albums.items[album].images[0].url)
                response.items.forEach(function(track) {
                    var html = '<li><a href="#" class="js-track-select" data-img="' + albums.items[album].images[0].url + '" data-url="' + track.preview_url + '" data-artist="' + track.artists[0].name + '" data-name="' + track.name + '">' +
                        track.name +
                        '</a></li>';
                    $('.js-track-list').append(html)
                });
                $('.available-albums-list').toggleClass('invisible');
                $('.album-info-box').toggleClass('invisible');
            }
        });
    });

    $('.js-track-list').delegate('.js-track-select', 'click', function(event) {
        event.preventDefault();
        var preview = event.currentTarget.getAttribute('data-url');
        var art = event.currentTarget.getAttribute('data-artist');
        var title = event.currentTarget.getAttribute('data-name')
        var imgSrc = event.currentTarget.getAttribute('data-img')
        if($('.js-play').hasClass('playing')) {
            $('.js-play').removeClass('playing');
        }
        $('.seekbar progress').prop('value', 0);
        $('.cover img').prop('src', imgSrc);
        $('.author').text(art);
        $('.title').text(title);
        $('.js-player').prop('src', preview);
    });

    $('.back-to-albums').on('click', function(event) {
        event.preventDefault();
        $('.available-albums-list').toggleClass('invisible');
        $('.album-info-box').toggleClass('invisible');
    });

});
