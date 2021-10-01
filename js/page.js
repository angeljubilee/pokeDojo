/* global data, $views, $pageLinks, $cardCount */
/* exported showView, setCardCount, showPage, hidePage, updatePageLinks */

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
    case 'empty':
    case 'loading':
    case 'error':
      $pageLinks.className += ' hidden';
      break;
    default:
      $pageLinks.className = 'page-links row flex-end align-center';
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

function updatePageLinks(currentPage) {
  const totalPages = Math.ceil(currentPage.data.items.length /
    currentPage.data.numPerPage);

  if (currentPage.pageNum === 0) {
    $pageLinks.children[0].classList = 'hidden';
  } else {
    $pageLinks.children[0].classList = '';
  }

  if (currentPage.pageNum >= totalPages - 1) {
    $pageLinks.children[1].className = 'hidden';
  } else {
    $pageLinks.children[1].className = '';
  }
}
