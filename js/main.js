var pokemonCardSets = null;
var cardSetNames = [];
var numPerPage = 16;
var pageNum = 0;
var $cardLogos = document.querySelector('.card-logos');
var $search = document.querySelector('input');
var $nextPage = document.querySelector('a');

window.addEventListener('DOMContentLoaded', getPokemonCardSets);
$cardLogos.addEventListener('click', handleLogoClick);
$search.addEventListener('keypress', handleSearch);
$nextPage.addEventListener('click', handleNextPageClick);

function handleLogoClick(event) {
  if (!event.target.matches('img')) {
    return;
  }
  var setIndex = event.target.closest('li').getAttribute('set-id');
  getPokemonCards(pokemonCardSets[setIndex].id);
}

function handleSearch(event) {
  if (event.keyCode !== 13) {
    return;
  }

  var setID = cardSetNames.indexOf($search.value.toLowerCase());
  if (setID > -1) {
    getPokemonCards(setID);
  } else {
    getPokemonCardsByPokemon($search.value);
  }
  $search.value = '';
}

function handleNextPageClick(event) {
  hideLogos(pageNum * numPerPage, pageNum * numPerPage + numPerPage);
  pageNum++;
  createLogosDOM(pageNum * numPerPage, pageNum * numPerPage + numPerPage);
}

function getPokemonCardSets() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate');
  xhr.setRequestHeader('X-Api-Key', 'e29addcb-977c-449c-8e43-f97935b91eb6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCardSets = xhr.response.data;
    createLogosDOM(numPerPage * pageNum, numPerPage);
    pokemonCardSets.forEach(set => {
      cardSetNames.push(set.name.toLowerCase());
    });
  });
  xhr.send();
}

function getPokemonCards(series) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pokemontcg.io/v2/cards?q=set.id:' + series);
  xhr.setRequestHeader('X-Api-Key', 'e29addcb-977c-449c-8e43-f97935b91eb6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {

  });
  xhr.send();
}

function getPokemonCardsByPokemon(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pokemontcg.io/v2/cards?q=name:' + name);
  xhr.setRequestHeader('X-Api-Key', 'e29addcb-977c-449c-8e43-f97935b91eb6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
  });
  xhr.send();
}

function createLogosDOM(start, end) {
  for (var i = start; i < end; i++) {
    if (i >= pokemonCardSets.length) {
      return;
    }
    var $li = document.createElement('li');
    $li.className = 'column-fourth';
    $li.setAttribute('set-id', i);
    var $img = document.createElement('img');

    $img.setAttribute('src', pokemonCardSets[i].images.logo);
    $li.appendChild($img);
    $cardLogos.appendChild($li);
  }
}

function hideLogos(start, end) {
  for (var i = start; i < end; i++) {
    if (i >= $cardLogos.children.length) {
      return;
    }
    $cardLogos.children[i].className = 'hidden';
  }
}
