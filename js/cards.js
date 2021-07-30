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
  if (viewMode === 'add') {
    $nextPage.className += ' hidden';
  } else {
    $nextPage.className = 'next-link';
  }
}

function setCardCount() {
  $cardCount.forEach(element => {
    element.textContent = data.myDeck.length;
  });
}
