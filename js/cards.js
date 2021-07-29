/* global $views, $nextPage */
/* exported showView */

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
    $nextPage.className += 'next-link';
  }
}
