// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
PokemonApp.Pokemon = function(pokemonUri) {
    this.id = this.idFromUri(pokemonUri);
};

PokemonApp.Pokemon.prototype.render = function() {
    console.log("Rendering pokemon: #" + this.id);
    var self = this;
    $.ajax({
        url: "/api/pokemon/" + this.id,
        success: self.pokemonDetailsToHTML.bind(this)
    });
};

PokemonApp.Pokemon.prototype.pokemonDetailsToHTML = function(response) {
    self.info = response;
    console.log("Pokemon Info: ");
    console.log(self.info);
    $('.js-pokemon-name').text(self.info.name);
    $('.js-pokemon-number').text(self.info.pkdx_id);
    $('.js-pokemon-height').text(self.info.height);
    $('.js-pokemon-weight').text(self.info.weight);
    $('.js-pokemon-hp').text(self.info.hp);
    $('.js-pokemon-attack').text(self.info.attack);
    $('.js-pokemon-defense').text(self.info.defense);
    $('.js-pokemon-sp_atk').text(self.info.sp_atk);
    $('.js-pokemon-sp_def').text(self.info.sp_def);
    $('.js-pokemon-speed').text(self.info.speed);
    var types = [];
    self.info.types.forEach(function(type) {
        types.push(type.name);
    });
    $('.js-pokemon-types').text(types.join(', '));
    $('.js-loading').modal("hide");
    $('.js-pokemon-modal').modal("show");
    if(self.info.sprites.length > 0) {
        this.getImageUrl(self.info.sprites[0].resource_uri);
    } else {
        $('.js-pokemon-image').prop('src', "http://retrogamecon.com/wp-content/uploads/2015/03/4944194780_No_pokemon_allowed_by_starpixel12_answer_2_xlarge.png");
        $('.js-pokemon-image').css("height", "100px");
    }
    this.getDescription(self.info.descriptions);
}

PokemonApp.Pokemon.prototype.getDescription = function(desc) {
    var self = this;
    $('.js-pokemon-desc').empty();
    var descriptions = self.selectLastGen(desc);
    descriptions.forEach(function(item){
        $.ajax({
            url: item.resource_uri,
            success: self.renderDescription
        });
    });
};

PokemonApp.Pokemon.prototype.selectLastGen = function(desc){
    var descriptions = [];
    var generation = 0;
    desc.forEach(function(item) {
        if(item.name.split("_")[2] >= generation){
            if(item.name.split("_")[2] > generation){
                descriptions = [];
                generation = item.name.split("_")[2];
            }
            descriptions.push(item);
        }
    });
    console.log(descriptions);
    return descriptions;
}

 PokemonApp.Pokemon.prototype.renderDescription = function(response) {
     console.log(response);
     var html = '<p>' + response.description + "</p>";
     $('.js-pokemon-desc').append(html);
 }

 PokemonApp.Pokemon.prototype.getImageUrl = function(sprUrl) {
     var self = this;
     $('.js-pokemon-image').prop('src', "888");
    $.ajax({
        url: sprUrl,
        success: self.renderImage
    });
};

PokemonApp.Pokemon.prototype.renderImage = function(response) {
    var imgSrc = "http://pokeapi.co" + response.image;
    console.log(imgSrc);
    $('.js-pokemon-image').prop('src', imgSrc);
}

PokemonApp.Pokemon.prototype.idFromUri = function(pokemonUri) {
    var UriSegments = pokemonUri.split('/');
    var secondLast = UriSegments.length - 2;
    return UriSegments[secondLast];
};

$(document).on('ready', function() {

    $('.js-show-pokemon').on('click', function(event) {
        $('.js-loading').modal("show");
        var $button = $(event.currentTarget);
        var pokemonUri = $button.data("pokemonUri");
        var pokemon = new PokemonApp.Pokemon(pokemonUri);
        pokemon.render();
    });
});
