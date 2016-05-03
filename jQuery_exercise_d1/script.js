var phrases = [
    "I like pie",
    "This is a phrase",
    "I'm tired",
    "It's nap time."
];

var loader = [];

var loadPhrase = function() {
    var phrase = phrases[Math.floor(Math.random() * (phrases.length))];
    $('.js-phrase').text(phrase);
}

var showPhrases = function() {
    phrases.forEach(function(value, index) {
        var to_append = "<li>" + value + '<button class="show" id="button' + index + '">shown</button>' + "</li>"
        $('.js-phrases-list').append(to_append);
    });
}

$(document).on('ready', function() {
    loadPhrase();
    showPhrases();
});

$('.btn').on('click', function() {
    loadPhrase();
});

$('.js-form').on('submit', function(event) {
    event.preventDefault();
    phrases.push($('.js-new')[0].value);
    $('.js-phrases-list').append("<li>" + $('.js-new')[0].value + '<button class="show" id="button' + (phrases.length - 1) + '">shown</button>' + "</li>");
    $('.js-new')[0].value = "";
});

$('.js-all').on('click', function() {
    $('.js-phrases-list').toggleClass('hidden');
    if( $('.js-phrases-list').hasClass('hidden') ){
        $('.js-all').text("Show sentences");
    } else {
        $('.js-all').text("Hide sentences");
    }
});

$('.js-phrases-list').delegate('button','click', function() {
    var selector = $(this).prop('id');
    $('#' + selector).toggleClass('active');
    $('#' + selector).parent().toggleClass('crossed')
});
