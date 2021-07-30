/* exported data */

var data = {
  view: 'logos',
  myDeck: [],
  pageNum: 0,
  numPerPage: 8
};

var prevData = localStorage.getItem('javascript-local-storage');
if (prevData) {
  data = JSON.parse(prevData);
}

window.addEventListener('beforeunload', handleLocalStorage);

function handleLocalStorage(event) {
  data.pageNum = 0;
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataJSON);
}
