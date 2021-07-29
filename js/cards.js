/* global data, seriesLogo */
/* exported pokemonCards, $cardsUL, createCardsDOM, seriesLogo, $cardsUL */

var pokemonCards = {
  cards: [],
  pageNum: 0,
  numPerPage: 15
};

var $cardsUL = document.querySelector('.cards');
var $logo = document.querySelector('.series-logo');
var $main = document.querySelector('.main-header');
var $views = document.querySelectorAll('.view');

function createCardsDOM(start, end) {
  for (var i = start; i < end; i++) {
    if (i >= pokemonCards.cards.length) {
      break;
    }
    var $li = document.createElement('li');
    $li.className = 'column-fifth';
    var $img = document.createElement('img');
    $img.setAttribute('src', pokemonCards.cards[i].images.small);
    $li.appendChild($img);
    $cardsUL.appendChild($li);
  }

  data.view = 'cards';
  $main.className += ' hidden';
  $logo.setAttribute('src', seriesLogo);
  $logo.className = 'series-logo';
  showView('cards');
}

function showView(viewMode) {
  $views.forEach(view => {
    if (view.getAttribute('data-view') === viewMode) {
      view.className = 'view';
    } else {
      view.className = 'view hidden';
    }
  });
}
