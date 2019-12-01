chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
  if(msg.type === "loaddata") {
    loadData2(sendResponse, msg.id);
    return true;
  }
});

function loadData2(resp, categoryId) {
  var url = 'https://xl-catalog-api.rozetka.com.ua/v2/goods/getFilters?front-type=xl&category_id='+categoryId;  
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      resp(xhr.responseText);
    }
  };
  xhr.send();
}