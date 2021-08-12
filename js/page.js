/* global data, $views, $nextPage, $cardCount */
/* exported showView, setCardCount, showPage, hidePage */

function showView(viewMode) {
  data.view = viewMode;
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
  $cardCount.textContent = data.myDeck.items.length;
}

function hidePage(elementArray, start, end) {
  for (var i = start; i < end; i++) {
    if (i >= elementArray.length) {
      return;
    }
    var className = elementArray[i].className;
    var hiddenIndex = className.indexOf('hidden');
    if (hiddenIndex === -1) {
      elementArray[i].className += ' hidden';
    }
  }
}

function showPage(elementArray, start, end) {
  for (var i = start; i < end; i++) {
    if (i < 0 || i >= elementArray.length) {
      return;
    }
    var className = elementArray[i].className;
    var hiddenIndex = className.indexOf('hidden');
    if (hiddenIndex !== -1) {
      elementArray[i].className = className.slice(0, hiddenIndex - 1);
    }
  }
}
