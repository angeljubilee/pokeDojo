/* global data, $views, $nextPage, $cardCount */
/* exported showView, setCardCount */

function showView(viewMode) {
  $views.forEach(view => {
    if (view.getAttribute('data-view') === viewMode) {
      view.className = 'view';
    } else {
      view.className = 'view hidden';
    }
  });

  switch (viewMode) {
    case 'add':
    case 'myCard':
    case 'pokemon':
      $nextPage.className += ' hidden';
      break;
    default:
      $nextPage.className = 'next-link';
  }
}

function setCardCount() {
  $cardCount.forEach(element => {
    element.textContent = data.myDeck.length;
  });
}
