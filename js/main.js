/* global data, showView, setCardCount, showPage, hidePage */
/* exported $views, $cardCount */

const pokemonCardSets = {
  items: [],
  pageTotal: 0,
  numPerPage: 16
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
const $pageLink = document.querySelector('.page-link');
const $pokemonCard = document.querySelector('.pokemon-card');
const $addButton = document.querySelector('.add-button');
const $backLink = document.querySelector('.back-link');
let $cardsUL = document.querySelector('.cards');
const $logo = document.querySelector('.series-logo');
const $main = document.querySelector('.main-header');
let $views = document.querySelectorAll('.view');
let $cardCount = document.querySelector('.card-count');
const $myDeckLink = document.querySelector('.my-deck-list');
const $myDeck = document.querySelector('.my-deck');
const $myCard = document.querySelector('.my-card');
const $pokemonTitle = document.querySelector('.pokemon-title');
const $pokemon = document.querySelector('.pokemon');
const $pokemonBackButton = document.querySelector('.pokemon-back');
const $removeCard = document.querySelector('.remove-card');
const $pokeDojo = document.querySelector('.pokedojo-title');

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
    getPokemonCards(setID);
    seriesLogo = pokemonCardSets.items[setID].images.logo;
  } else {
    getPokemonCardsByPokemon($search.value);
  }
  $search.value = '';
});

$pageLink.addEventListener('click', (handlePageClick));
$cardsUL.addEventListener('click', handleCardClick);
$addButton.addEventListener('click', handleAddClick);
$backLink.addEventListener('click', handleBackClick);
$myDeckLink.addEventListener('click', handleMyDeckClick);
$myDeck.addEventListener('click', handleMyDeckCardClick);
$pokemonTitle.addEventListener('click', handlePokemonClick);
$pokemonBackButton.addEventListener('click', handlePokemonBack);
$removeCard.addEventListener('click', handleRemove);
$pokeDojo.addEventListener('click', handleHeadingClick);

function handleHeadingClick(event) {
  showView('logos');
}

function handlePageClick(event) {
  const link = event.target.textContent;
  let nextPageNum = 0;
  switch (link) {
    case '< Back' :
      nextPageNum = currentPage.pageNum - 1;
      break;
    case 'Next >' :
      nextPageNum = currentPage.pageNum + 1;
      break;
    default:
      nextPageNum = parseInt(link) - 1;
  }

  let start = currentPage.pageNum * currentPage.data.numPerPage;
  hidePage(currentPage.$UL.children, start, start + currentPage.data.numPerPage);

  if (nextPageNum <= currentPage.data.pageTotal - 1) {
    start = nextPageNum * currentPage.data.numPerPage;
    showPage(currentPage.$UL.children, start,
      start + currentPage.data.numPerPage);
    currentPage.pageNum = nextPageNum;
    updatePageLink(currentPage);
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
  updatePageLink(currentPage);
}

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

function handleAddClick(event) {
  const cardIndex = $pokemonCard.getAttribute('data-view');
  data.myDeck.items.push(pokemonCards.cards[cardIndex]);
  setCardCount();
  showView('cards');
}

function handleBackClick(event) {
  showView('cards');
}

function handleMyDeckClick(event) {
  currentPage.pageNum = 0;
  if (!data.myDeck.pageTotal) {
    createMyDeckDOM(0, data.myDeck.numPerPage);
    data.myDeck.pageTotal++;
  } else {
    showPage($myDeck.children, 0, data.myDeck.numPerPage);
  }

  showView('myDeck');
}

function handleMyDeckCardClick(event) {
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
}

function handlePokemonClick(event) {
  getPokemonData(event.target.textContent);
}

function handlePokemonBack(event) {
  showView('myCard');
}

function handleRemove(event) {
  const $myCard = event.target.closest('.my-card');
  const cardIndex = $myCard.getAttribute('data-view');
  $myDeck.children[cardIndex].remove();
  data.myDeck.items.splice(cardIndex, 1);
  setCardCount();
  showView('myDeck');
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
    pokemonCardSets.items.forEach(set => {
      cardSetNames.push(set.name);
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
  xhr.open('GET', 'https://api.pokemontcg.io/v2/cards?q=set.id:' + series);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCards.cards = xhr.response.data;
    if (!pokemonCards.cards.length) {
      showView('empty');
      return;
    }
    pokemonCards.pageNum = 0;
    createCardsDOM(0, pokemonCards.numPerPage);
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
  xhr.open('GET', 'https://api.pokemontcg.io/v2/cards?q=name:' + name);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCards.cards = xhr.response.data;
    if (!pokemonCards.cards.length) {
      showView('empty');
      return;
    }
    const start = pokemonCards.pageNum * pokemonCards.numPerPage;
    createCardsDOM(start, start + pokemonCards.numPerPage);
    data.view = 'cards';
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
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + name.toLowerCase());
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
    $li.className = 'column-fifth';
    const $img = document.createElement('img');
    $img.setAttribute('src', pokemonCards.cards[i].images.small);
    $img.setAttribute('data-view', i);
    $li.appendChild($img);
    $ul.appendChild($li);
  }
  if (start === 0 && $cardsUL.children.length > 0) {
    let $cardsView;
    for (let j = 0; j < $views.length; j++) {
      if ($views[j].getAttribute('data-view') === 'cards') {
        $cardsView = $views[j];
      }
    }
    $cardsView.replaceChild($ul, $cardsUL);
    $cardsUL = $ul;
    $cardsUL.addEventListener('click', handleCardClick);
  }
}

function createMyDeckDOM(start, end) {
  for (let i = start; i < end; i++) {
    if (i >= data.myDeck.items.length) {
      break;
    }
    const $li = document.createElement('li');
    $li.className = 'column-fourth text-left';
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

function displayPageLinks(totalPages) {
  if (totalPages < 4) {
    for (let i = totalPages + 1; i < 4; i++) {
      $pageLink.children[i].className = 'hidden';
    }
    $pageLink.children[4].className = 'hidden';
  }
}

function updatePageLink(currentPage) {
  const totalPages = Math.ceil(currentPage.data.items.length /
  currentPage.data.numPerPage);
  if (currentPage.pageNum === 0) {
    $pageLink.children[0].classList = 'hidden';
  } else {
    $pageLink.children[0].classList = '';
  }

  if (currentPage.pageNum >= totalPages - 1) {
    $pageLink.children[4].className = 'hidden';
  } else {
    $pageLink.children[4].className = '';
  }

  if (currentPage.pageNum <= 2) {
    $pageLink.children[1].textContent = 1;
    $pageLink.children[2].textContent = 2;
    $pageLink.children[3].textContent = 3;
    return;
  }

  if (currentPage.pageNum >= (totalPages - 3)) {
    $pageLink.children[1].textContent = totalPages - 3;
    $pageLink.children[2].textContent = totalPages - 2;
    $pageLink.children[3].textContent = totalPages - 1;
    return;
  }

  const link1 = parseInt($pageLink.children[1].textContent);
  const link3 = parseInt($pageLink.children[3].textContent);

  if (currentPage.pageNum >= (link3 - 1) ||
  currentPage.pageNum <= (link1 - 1)) {
    $pageLink.children[1].textContent = currentPage.pageNum;
    $pageLink.children[2].textContent = currentPage.pageNum + 1;
    $pageLink.children[3].textContent = currentPage.pageNum + 2;
  }
}
