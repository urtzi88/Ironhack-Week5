if(window.PokemonApi === undefined) {
    window.PokemonApp = {};
}

PokemonApp.init = function() {
    // 3rd party setup code goes here
    console.log("POKEMON app online!");
};

$(document).on('ready', function() {
    PokemonApp.init();
});
