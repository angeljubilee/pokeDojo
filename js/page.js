/* global data, $views, $pageLink, $cardCount */
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
      $pageLink.children[4].className = 'hidden';
      break;
    default:
      $pageLink.children[4].className = '';
  }
}

function setCardCount() {
  $cardCount.textContent = data.myDeck.items.length;
}

function hidePage(elementArray, start, end) {
  for (let i = start; i < end; i++) {
    if (i >= elementArray.length) {
      return;
    }
    const className = elementArray[i].className;
    const hiddenIndex = className.indexOf('hidden');
    if (hiddenIndex === -1) {
      elementArray[i].className += ' hidden';
    }
  }
}

function showPage(elementArray, start, end) {
  for (let i = start; i < end; i++) {
    if (i < 0 || i >= elementArray.length) {
      return;
    }
    const className = elementArray[i].className;
    const hiddenIndex = className.indexOf('hidden');
    if (hiddenIndex !== -1) {
      elementArray[i].className = className.slice(0, hiddenIndex - 1);
    }
  }
}
