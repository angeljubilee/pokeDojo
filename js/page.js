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
  if (!currentPage && currentPage !== 0) {
    return;
  }

  const totalPages = Math.ceil(currentPage.data.items.length /
    currentPage.data.numPerPage);

  if (currentPage.pageNum === 0) {
    $pageLinks.children[0].classList = 'hidden';
  } else {
    $pageLinks.children[0].classList = '';
  }

  if (currentPage.pageNum >= totalPages - 1) {
    $pageLinks.children[4].classList = 'hidden';
  } else {
    $pageLinks.children[4].classList = '';
  }

  if (totalPages < 3) {
    $pageLinks.children[1].className = 'hidden';
    $pageLinks.children[2].className = 'hidden';
    $pageLinks.children[3].className = 'hidden';
    return;
  }

  if (currentPage.pageNum <= 2) {
    $pageLinks.children[1].getElementsByTagName('a')[0].textContent = 1;
    $pageLinks.children[2].getElementsByTagName('a')[0].textContent = 2;
    $pageLinks.children[3].getElementsByTagName('a')[0].textContent = 3;
  } else if (currentPage.pageNum >= (totalPages - 2)) {
    $pageLinks.children[1].getElementsByTagName('a')[0].textContent = totalPages - 2;
    $pageLinks.children[2].getElementsByTagName('a')[0].textContent = totalPages - 1;
    $pageLinks.children[3].getElementsByTagName('a')[0].textContent = totalPages;
  } else {
    const link1 = parseInt($pageLinks.children[1].textContent);
    const link3 = parseInt($pageLinks.children[3].textContent);

    if (currentPage.pageNum >= link3 || currentPage.pageNum <= link1) {
      const $link1 = $pageLinks.children[1].getElementsByTagName('a')[0];
      const $link2 = $pageLinks.children[2].getElementsByTagName('a')[0];
      const $link3 = $pageLinks.children[3].getElementsByTagName('a')[0];

      $link1.textContent = currentPage.pageNum;
      $link2.textContent = currentPage.pageNum + 1;
      $link3.textContent = currentPage.pageNum + 2;
    }
  }

  for (let i = 1; i <= 3; i++) {
    if ($pageLinks.children[i].getElementsByTagName('a')[0].textContent ===
      (currentPage.pageNum + 1).toString()) {
      $pageLinks.children[i].getElementsByTagName('a')[0].className = 'active';
    } else {
      $pageLinks.children[i].getElementsByTagName('a')[0].className = '';
    }
    $pageLinks.children[i].className = '';
  }
}
