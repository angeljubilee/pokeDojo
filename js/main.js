/* global data, showView, setCardCount, showPage, hidePage, updatePageLinks */
/* exported $views, $cardCount, $pageLinks */

const pokemonCardSets = {
  items: [],
  pageTotal: 0,
  numPerPage: 15
};

const pokemonCards = {
  items: [],
  pageTotal: 0,
  numPerPage: 15
};

const currentPage = {
  data: [],
  $UL: [],
  pageNum: 0
};

let seriesLogo = '';
const cardSetNames = [];
let pokemonData = {};

const $logosUL = document.querySelector('.logos');
const $search = document.querySelector('input');
const $pageLinks = document.querySelector('.page-links');
const $pokemonCard = document.querySelector('.pokemon-card');
const $addButton = document.querySelector('.add-button');
const $backLink = document.querySelector('.back-link');
let $cardsUL = document.querySelector('.cards');
const $cards = document.querySelector('.card-list');
const $logo = document.querySelector('.series-logo');
const $main = document.querySelector('.main-header');
let $views = document.querySelectorAll('.view');
let $cardCount = document.querySelector('.card-count');
const $myDeckLink = document.querySelector('.my-deck');
const $myDeck = document.querySelector('.my-deck-list');
const $myCard = document.querySelector('.my-card');
const $pokemonTitle = document.querySelector('.pokemon-title');
const $pokemon = document.querySelector('.pokemon');
const $pokemonBackButton = document.querySelector('.pokemon-back');
const $removeCard = document.querySelector('.remove-card');
const $pokemonCardCollector = document.querySelector('.pokemon-card-collector');

window.addEventListener('DOMContentLoaded', event => {
  setCardCount();
  getPokemonCardSets();
});

$logosUL.addEventListener('click', event => {
  if (!event.target.matches('img')) {
    return;
  }
  const setIndex = event.target.closest('li').getAttribute('set-id');
  getPokemonCards(pokemonCardSets.items[setIndex].id);
  seriesLogo = pokemonCardSets.items[setIndex].images.logo;
});

$search.addEventListener('keypress', event => {
  if (event.keyCode !== 13) {
    return;
  }

  const setID = cardSetNames.indexOf($search.value.toLowerCase());
  if (setID > -1) {
    getPokemonCards(pokemonCardSets.items[setID].id);
    seriesLogo = pokemonCardSets.items[setID].images.logo;
  } else {
    getPokemonCardsByPokemon($search.value);
  }
  $search.value = '';
});

$addButton.addEventListener('click', event => {
  const cardIndex = $pokemonCard.getAttribute('data-view');
  data.myDeck.items.push(pokemonCards.cards[cardIndex]);
  const numPerPage = data.myDeck.numPerPage;
  if (cardIndex < data.myDeck.pageNum * numPerPage + numPerPage) {
    createMyDeckCardDOM(cardIndex);
  }
  setCardCount();
  showView('cards');
});

$backLink.addEventListener('click', event => {
  showView('cards');
});

$myDeckLink.addEventListener('click', event => {
  currentPage.pageNum = 0;
  if (!data.myDeck.pageTotal) {
    createMyDeckDOM(0, data.myDeck.numPerPage);
    data.myDeck.pageTotal++;
  } else {
    showPage($myDeck.children, 0, data.myDeck.numPerPage);
  }

  showView('myDeck');
});

$myDeck.addEventListener('click', event => {
  if (!event.target.matches('img')) {
    return;
  }
  const cardIndex = event.target.getAttribute('data-view');
  const card = data.myDeck.items[cardIndex];
  $myCard.getElementsByTagName('h4')[0].textContent = card.name;
  $myCard.getElementsByTagName('img')[0].setAttribute('src', card.images.large);
  $myCard.getElementsByTagName('a')[1].setAttribute('href', card.tcgplayer.url);
  $myCard.setAttribute('data-view', cardIndex);
  showView('myCard');
});

$pokemonTitle.addEventListener('click', event => {
  getPokemonData(event.target.textContent);
});

$pokemonBackButton.addEventListener('click', event => {
  showView('myCard');
});

$removeCard.addEventListener('click', event => {
  const $myCard = event.target.closest('.my-card');
  const cardIndex = $myCard.getAttribute('data-view');
  $myDeck.children[cardIndex].remove();
  data.myDeck.items.splice(cardIndex, 1);
  setCardCount();
  showView('myDeck');
});

$pokemonCardCollector.addEventListener('click', event => {
  showView('logos');
});

$pageLinks.addEventListener('click', event => {
  const link = event.target.textContent;
  let nextPageNum;
  switch (link) {
    case '< Back':
      if (currentPage.pageNum > 0) {
        nextPageNum = currentPage.pageNum - 1;
      } else {
        nextPageNum = 0;
      }
      break;
    case 'Next >':
      nextPageNum = currentPage.pageNum + 1;
  }

  let start = currentPage.pageNum * currentPage.data.numPerPage;
  hidePage(currentPage.$UL.children, start, start + currentPage.data.numPerPage);

  if (nextPageNum < currentPage.data.pageTotal) {
    start = nextPageNum * currentPage.data.numPerPage;
    showPage(currentPage.$UL.children, start, start + currentPage.numPerPage);
    currentPage.pageNum = nextPageNum;
    updatePageLinks(currentPage);
    return;
  }

  start = nextPageNum * currentPage.data.numPerPage;
  if (data.view === 'logos') {
    createLogosDOM(start, start + pokemonCardSets.numPerPage);
    pokemonCardSets.pageTotal++;
  } else if (data.view === 'cards') {
    createCardsDOM(start, start + pokemonCards.numPerPage);
    pokemonCards.pageTotal++;
  } else if (data.view === 'myDeck') {
    createMyDeckDOM(start, start + data.myDeck.numPerPage);
    data.myDeck.pageTotal++;
  }

  currentPage.pageNum = nextPageNum;
  updatePageLinks(currentPage);
});

$cards.addEventListener('click', handleCardClick);

function handleCardClick(event) {
  if (!event.target.matches('img')) {
    return;
  }
  const cardIndex = event.target.getAttribute('data-view');
  const pokemonCard = pokemonCards.cards[cardIndex];

  $pokemonCard.setAttribute('src', pokemonCard.images.large);
  $pokemonCard.setAttribute('data-view', cardIndex);
  showView('add');
}

function getPokemonCardSets() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate');
  xhr.setRequestHeader('X-Api-Key', 'e29addcb-977c-449c-8e43-f97935b91eb6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCardSets.items = xhr.response.data;
    if (!pokemonCardSets.items.length) {
      showView('empty');
      return;
    }
    createLogosDOM(0, pokemonCardSets.numPerPage);
    currentPage.data = pokemonCardSets;
    currentPage.$UL = $logosUL;
    currentPage.pageNum = 0;
    pokemonCardSets.items.forEach(set => {
      cardSetNames.push(set.name.toLowerCase());
    });
    const totalPages = Math.ceil(pokemonCardSets.items.length /
      pokemonCardSets.numPerPage);
    displayPageLinks(totalPages);
    showView('logos');
  });
  xhr.addEventListener('error', function () {
    showView('error');
  });
  xhr.send();
  showView('loading');
}

function getPokemonCards(series) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.pokemontcg.io/v2/cards?q=set.id:${series}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCards.cards = xhr.response.data;
    if (!pokemonCards.cards) {
      showView('empty');
      return;
    }
    pokemonCards.pageNum = 0;
    createCardsDOM(0, pokemonCards.numPerPage);
    currentPage.data = pokemonCards;
    currentPage.$UL = $cardsUL;
    currentPage.pageNum = 0;
    data.view = 'cards';
    $logo.getElementsByTagName('img')[0].setAttribute('src', seriesLogo);
    $logo.className = 'series-logo';
    showView('cards');
  });
  xhr.addEventListener('error', function () {
    showView('error');
  });
  xhr.send();
  showView('loading');
}

function getPokemonCardsByPokemon(name) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.pokemontcg.io/v2/cards?q=name:${name}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCards.cards = xhr.response.data;
    if (!pokemonCards.cards) {
      showView('empty');
      return;
    }
    createCardsDOM(0, pokemonCards.numPerPage);
    data.view = 'cards';
    currentPage.data = pokemonCards;
    currentPage.$UL = $cardsUL;
    currentPage.pageNum = 0;
    showView('cards');
  });
  xhr.addEventListener('error', function () {
    showView('error');
  });
  xhr.send();
  showView('loading');
}

function getPokemonData(name) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonData = xhr.response;
    $pokemon.getElementsByTagName('img')[0].setAttribute('src',
      pokemonData.sprites.other['official-artwork'].front_default);
    $pokemon.getElementsByTagName('h5')[0].textContent = '#' +
      pokemonData.id + ' ' + pokemonData.name[0].toUpperCase() +
      pokemonData.name.slice(1);
    const cardIndex = $myCard.getAttribute('data-view');
    $pokemon.getElementsByTagName('p')[0].textContent =
      data.myDeck.items[cardIndex].flavorText;
    showView('pokemon');
  });
  xhr.addEventListener('error', function () {
    showView('error');
  });
  xhr.send();

  showView('loading');
}

function createLogosDOM(start, end) {
  for (let i = start; i < end; i++) {
    if (i >= pokemonCardSets.items.length) {
      return;
    }
    const $li = document.createElement('li');
    $li.className = 'column-fourth';
    $li.setAttribute('set-id', i);
    const $img = document.createElement('img');
    $img.setAttribute('src', pokemonCardSets.items[i].images.logo);
    $li.appendChild($img);
    $logosUL.appendChild($li);
    data.view = 'logos';
  }
}

function createCardsDOM(start, end) {
  let $ul;
  if (start === 0 && $cardsUL.children.length > 0) {
    $ul = document.createElement('ul');
    $ul.className = 'cards row flex-center';
  } else {
    $ul = $cardsUL;
  }

  for (let i = start; i < end; i++) {
    if (i >= pokemonCards.cards.length) {
      break;
    }
    const $li = document.createElement('li');
    $li.className = 'column-third';
    const $img = document.createElement('img');
    $img.setAttribute('src', pokemonCards.cards[i].images.small);
    $img.setAttribute('data-view', i);
    $li.appendChild($img);
    $ul.appendChild($li);
  }
  if (start === 0 && $cardsUL.children.length > 0) {
    $cards.replaceChild($ul, $cardsUL);
    $cardsUL = $ul;
  }
}

function createMyDeckDOM(start, end) {
  for (let i = start; i < end; i++) {
    if (i >= data.myDeck.items.length) {
      break;
    }
    const $li = document.createElement('li');
    $li.className = 'column-third text-left';
    const $h6 = document.createElement('h5');
    $h6.textContent = data.myDeck.items[i].name;
    $li.appendChild($h6);
    const $img = document.createElement('img');
    $img.setAttribute('src', data.myDeck.items[i].images.small);
    $img.setAttribute('data-view', i);
    $li.appendChild($img);
    $myDeck.appendChild($li);
  }

  data.view = 'myDeck';
  $main.className = 'main-header';
  $logo.className += ' hidden';
  showView('myDeck');
}

function createMyDeckCardDOM(i) {
  const $li = document.createElement('li');
  $li.className = 'column-third text-left';
  const $h6 = document.createElement('h5');
  $h6.textContent = data.myDeck.items[i].name;
  $li.appendChild($h6);
  const $img = document.createElement('img');
  $img.setAttribute('src', data.myDeck.items[i].images.small);
  $img.setAttribute('data-view', i);
  $li.appendChild($img);
  $myDeck.appendChild($li);
}

function displayPageLinks(totalPages) {
  if (totalPages < 4) {
    for (let i = totalPages + 1; i < 4; i++) {
      $pageLinks.children[i].className = 'hidden';
    }
    $pageLinks.children[4].className = 'hidden';
  }
}
