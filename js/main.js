/* global data, showView */
/* exported $views */

var pokemonCardSets = {
  sets: [],
  pageNum: 0,
  numPerPage: 16
};

var pokemonCards = {
  cards: [],
  pageNum: 0,
  numPerPage: 15
};

var seriesLogo = '';
var cardSetNames = [];
var $logosUL = document.querySelector('.logos');
var $search = document.querySelector('input');
var $nextPage = document.querySelector('.next-link');
var $pokemonCard = document.querySelector('.pokemon-card');
var $addButton = document.querySelector('.add-button');
var $backLink = document.querySelector('.back-link');
var $cardsUL = document.querySelector('.cards');
var $logo = document.querySelector('.series-logo');
var $main = document.querySelector('.main-header');
var $views = document.querySelectorAll('.view');
var $cardCount = document.querySelector('.card-count');

window.addEventListener('DOMContentLoaded', loadData);
$logosUL.addEventListener('click', handleLogoClick);
$search.addEventListener('keypress', handleSearch);
$nextPage.addEventListener('click', handleNextPageClick);
$cardsUL.addEventListener('click', handleCardClick);
$addButton.addEventListener('click', handleAddClick);
$backLink.addEventListener('click', handleBackClick);

function loadData(event) {
  $cardCount.textContent = data.myDeck.length;
  getPokemonCardSets();
}

function handleLogoClick(event) {
  if (!event.target.matches('img')) {
    return;
  }
  var setIndex = event.target.closest('li').getAttribute('set-id');
  getPokemonCards(pokemonCardSets.sets[setIndex].id);
  seriesLogo = pokemonCardSets.sets[setIndex].images.logo;
}

function handleSearch(event) {
  if (event.keyCode !== 13) {
    return;
  }

  var setID = cardSetNames.indexOf($search.value.toLowerCase());
  if (setID > -1) {
    getPokemonCards(setID);
    seriesLogo = pokemonCardSets.sets[setID].images.logo;
  } else {
    getPokemonCardsByPokemon($search.value);
  }
  $search.value = '';
}

function handleNextPageClick(event) {
  var start = 0;
  if (data.view === 'logos') {
    start = pokemonCardSets.pageNum * pokemonCardSets.numPerPage;
    hidePage($logosUL.children, start, start + pokemonCardSets.numPerPage);
    pokemonCardSets.pageNum++;
    createLogosDOM(start, start + pokemonCardSets.numPerPage);
    return;
  }
  if (data.view === 'cards') {
    start = pokemonCards.pageNum * pokemonCards.numPerPage;
    hidePage($cardsUL.children, start, start + pokemonCards.numPerPage);
    pokemonCards.pageNum++;
    createCardsDOM(start, start + pokemonCards.numPerPage);
  }
}

function handleCardClick(event) {
  if (!event.target.matches('img')) {
    return;
  }
  var cardIndex = event.target.getAttribute('data-view');
  var pokemonCard = pokemonCards.cards[cardIndex];
  $pokemonCard.setAttribute('src', pokemonCard.images.large);
  $pokemonCard.setAttribute('data-view', cardIndex);
  showView('add');
}

function handleAddClick(event) {
  var cardIndex = $pokemonCard.getAttribute('data-view');
  data.myDeck.push(pokemonCards.cards[cardIndex]);
  $cardCount.textContent = data.myDeck.length;
  showView('cards');
}

function handleBackClick(event) {
  showView('cards');
}

function getPokemonCardSets() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate');
  xhr.setRequestHeader('X-Api-Key', 'e29addcb-977c-449c-8e43-f97935b91eb6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCardSets.sets = xhr.response.data;
    var start = pokemonCardSets.numPerPage * pokemonCardSets.pageNum;
    createLogosDOM(start, start + pokemonCardSets.numPerPage);
    pokemonCardSets.sets.forEach(set => {
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
    pokemonCards.cards = xhr.response.data;
    var start = pokemonCards.pageNum * pokemonCards.numPerPage;
    createCardsDOM(start, start + pokemonCards.numPerPage);
  });
  xhr.send();
}

function getPokemonCardsByPokemon(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pokemontcg.io/v2/cards?q=name:' + name);
  xhr.setRequestHeader('X-Api-Key', 'e29addcb-977c-449c-8e43-f97935b91eb6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCards.cards = xhr.response.data;
    var start = pokemonCards.pageNum * pokemonCards.numPerPage;
    createCardsDOM(start, start + pokemonCards.numPerPage);
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
    $img.setAttribute('src', pokemonCardSets.sets[i].images.logo);
    $li.appendChild($img);
    $logosUL.appendChild($li);
  }
}

function createCardsDOM(start, end) {
  for (var i = start; i < end; i++) {
    if (i >= pokemonCards.cards.length) {
      break;
    }
    var $li = document.createElement('li');
    $li.className = 'column-fifth';
    var $img = document.createElement('img');
    $img.setAttribute('src', pokemonCards.cards[i].images.small);
    $img.setAttribute('data-view', i);
    $li.appendChild($img);
    $cardsUL.appendChild($li);
  }

  data.view = 'cards';
  $main.className += ' hidden';
  $search.className += ' hidden';
  $logo.setAttribute('src', seriesLogo);
  $logo.className = 'series-logo';
  showView('cards');
}

function hidePage(elementArray, start, end) {
  for (var i = start; i < end; i++) {
    if (i >= elementArray.length) {
      return;
    }
    elementArray[i].className = 'hidden';
  }
}
