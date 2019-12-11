chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
  if(msg.type === "loaddata") {
    //loadData2(sendResponse, msg.id);
    loadData2(sendResponse, msg.urlStrObj);
    return true;
  }
  if(msg.type === "goods") {
    loadGoods(sendResponse, msg.obj);
    return true;
  }
});

function loadData2(resp, urlStrObj) {
  console.log(urlStrObj);
  let urlStr = `category_id=${urlStrObj.id}&${urlStrObj.params}`;
  console.log(urlStr);
  //var url = 'https://xl-catalog-api.rozetka.com.ua/v2/goods/getFilters?front-type=xl&category_id='+categoryId;  
  var url = 'https://xl-catalog-api.rozetka.com.ua/v2/goods/getFilters?front-type=xl&' + urlStr;
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

function loadGoods(resp, { category, strParams}) {
  console.log(category, strParams);
  let url = `https://xl-catalog-api.rozetka.com.ua/v2/goods/get?front-type=xl&category_id=${category}&${strParams}`;  
  fetch(url)
    .then(response => response.json())
    .then(result => resp(result.data.ids_count));
}