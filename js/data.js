/* exported data */

var data = {
  view: 'logos',
  myDeck: {
    items: [],
    pageTotal: 0,
    numPerPage: 8
  }
};

var prevData = localStorage.getItem('javascript-local-storage');
if (prevData) {
  data = JSON.parse(prevData);
}

window.addEventListener('beforeunload', handleLocalStorage);

function handleLocalStorage(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataJSON);
}
