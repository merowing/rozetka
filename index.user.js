(function(){

    //chrome.extension.sendMessage(
    //    {contentScriptQuery: "queryPrice", itemId: 12345},
    //    data => console.log(data));
        
//return;
    let url = window.location.href;
    let checkItemIds = [];
    let defaultLen = 0;

    // parse json string data and convert to json object ------------
    let str = document.querySelector("#rz-client-state").innerText;
    let json, options;
    if(/&q;/.test(str)) {
        str = str.replace(/&q;/g,'"');
        str = str.replace(/&a;/g,'&');
        
        let start = str.match(/"options/).index;
        let end = str.indexOf(",\"chosen\"", start);
        json = JSON.parse("{" + str.substr(start,end-start) + "}");
        
        options = json.options;
    }else {
        json = JSON.parse(str);
        options = json.data.options;
    }
    console.log(json);
    //console.log(options);
//return;
    
    let keys = Object.keys(options);
    let skip = ["price", "tegi"]; // option_name | skip blocks
    let skipFound = [];
    let categoriesObj = {};
    categoriesObj.items = [];
    /*{
        [{
            title: "",
            category:"",
            id:"",
            name:""
        }]
    }*/
    //console.log(keys);
    for(let i = 0; i < keys.length; i++) {
        if(("option_values" in options[keys[i]])) {

            skipFound = [];
            skipFound = skip.filter(function(val) {
                return (options[keys[i]].option_name.indexOf(val) >= 0);
            });
            if(skipFound.length) continue;

            let optionId = options[keys[i]].option_name;
            let optionTitle = options[keys[i]].option_title;

            let values = options[keys[i]].option_values;
            let optionsObj = {};
            for(let j = 0; j < values.length; j++) {
                //console.log(options[keys[i]].option_name +"-"+ values[j].option_value_name);
                optionsObj = {
                    "title": optionTitle,
                    "category": optionId,
                    "id": values[j].option_value_name,
                    "name": values[j].option_value_title
                };
                categoriesObj.items.push(optionsObj);
            }
        }
    }
    console.log(categoriesObj);
    // -------------


    function generation() {
        //return;
        let sidebar = document.querySelector('aside.sidebar');
        if(sidebar) {
        let items = sidebar.querySelectorAll('li.checkbox-filter__item > a');

        // show first sidebar block because he has hidden sometimes
        sidebar.querySelector('div').removeAttribute('style');

        // ----------

        // set new attribute param for all items
        for(let i = 0; i < items.length; i++) {
            let getCategory = getBlockCategory(items[i]);
            let getCategoryStr = getCategory.firstChild.nodeValue.replace(/^\s+|\s+$/g,'');
            //console.log(getCategory);
            let objItems = categoriesObj.items;
            for(let j = 0; j < objItems.length; j++) {
                let categTitle = objItems[j].title; // name of block
                let categ = objItems[j].category; // name of category
                let valueId = objItems[j].id; // id of item
                let valueName = objItems[j].name; // name of item

                //console.log(getCategory);
                if(items[i].querySelector('input').id === valueName && getCategoryStr === categTitle) {
                    items[i].querySelector('label').setAttribute("param", categ+"="+valueId);
                }
            }
        }
        // ----------

        // if event click added on the first label, stop load function
        // to check first tag enough, added event click or not
        //if(items[0].querySelector('label').getAttribute("click")) return;

        console.log(items.length);
        let len = items.length;
        //let vanillaUrl = window.location.href;

        let label, input;//, link;
        //let indexItem;

        let urlStr = "";
        let urlStrArr = [];
        //let vanillaUrlStr = "";

        // -----------
        if(!defaultLen) defaultLen = len;
        
        // якщо ми змінили метод сортування через select, перезаписуємо url
        let select = document.querySelector('.catalog-settings select');
        select.onchange = function() {
            console.log("yes");
            url = window.location.href;
        };

        // коли переходимо на нову сторінку, очищаємо масив відмічених предметів
        if(url.indexOf("=") === -1) checkItemIds = [];

        // -----------

        let topClearItems = document.querySelector('ul.catalog-selection__list');
        let test = function(e) {
            //alert(e.currentTarget.tagName);
            url = window.location.href;
        };
        topClearItems.removeEventListener('click', test, false);
        topClearItems.addEventListener('click', test, false);

        for(let i = 0; i < len; i++) {

            // hide empty items --------------

            if(items[i].getAttribute('class').indexOf('disabled') >= 0 && !/\([0-9]+\)/.test(items[i].querySelector('label').textContent)) {
                items[i].parentElement.style.display = "none";
            }else {
                items[i].removeAttribute('class');
                items[i].setAttribute('class', "checkbox-filter__link checkbox-filter__link_state_disabled");
                items[i].style.color = "#333";
                if(items[i].querySelector('label > span')) {
                    items[i].querySelector('label > span').style.visibility = "visible";
                }
            }

            if(/\([0-9]+\)/.test(items[i].querySelector('label').textContent) || items[i].querySelector('input').checked) {
                items[i].parentElement.removeAttribute("style");
            }

            // -------------------------------

            //label = items[i];//.querySelector('label');
            label = sidebar.querySelectorAll('li.checkbox-filter__item > a.checkbox-filter__link.checkbox-filter__link_state_disabled')[i];
            
            // ------------
            /*if(len < defaultLen) {
                console.log("test");
                for(let o = 0; o < checkItemIds.length; o++) {
                    if(label.getAttribute("n") === checkItemIds[o].toString()) {
                        let cId = +checkItemIds[o] - 1;
                        console.log("cId: "+cId);
                        let prevId = items[cId].querySelector("label").getAttribute("n");
                        if(prevId !== checkItemIds[o].toString() && +prevId !== checkItemIds[o]) {
                            checkItemIds[o] = +prevId + 1;
                        }
                    }
                }
            }*/

            // ------------

            if(label.getAttribute('click')) continue;

            let checkItemParam = items[i].querySelector('label').getAttribute('param');
            if(checkItemParam) {
                let checkItemParamStr = checkItemParam.split('=')[1];
                let indParam = checkItemIds.indexOf(checkItemParamStr);
                if(items[i].querySelector('input').checked) {
                    if(indParam === -1) {
                        checkItemIds.push(checkItemParamStr);
                    }
                }

                /*for(let j = 0; j < checkItemIds.length; j++) {
                    if(!items[i].querySelector('input').checked && checkItemIds[j].toLowerCase() === items[i].querySelector('label').firstChild.nodeValue.replace(/^\s+|\s+$/g,'').toLocaleLowerCase()) {
                        checkItemIds.splice(indParam, 1);
                        console.log(items[i].querySelector('input').checked);
                        console.log(items[i]);
                        console.log(checkItemIds[j].toLowerCase() === items[i].querySelector('label').firstChild.nodeValue.replace(/^\s+|\s+$/g,'').toLocaleLowerCase());
                        console.log(checkItemIds[j].toLowerCase() +"==="+ items[i].querySelector('label').firstChild.nodeValue.replace(/^\s+|\s+$/g,'').toLocaleLowerCase());
                        url = window.location.href;
                    }
                }*/
                let urlItems = getItems(url);
                if(urlItems) {
                    for(let j = 0; j < checkItemIds.length; j++) {
                        if(urlItems.indexOf(checkItemIds[j]) === -1) {
                            console.log(urlItems);
                            checkItemIds.splice(j, 1);
                            j--;
                        }
                    }
                }
            }


            // set label event click on label tags
            label.setAttribute("click",true);
            //label.setAttribute("n", i);
            label.parentElement.addEventListener('click', function(e) {
                e.preventDefault();

                
                console.log(this.tagName);
                console.log(label.tagName);

                input = items[i].querySelector('input');
                indexItem = i;

                console.log(i);

                /*link = items[i].querySelector('a');
                let linkStr = link.href;
                let newItem = null;
                let newItemFound = false;
                let newCategory = null;
                let categoryNotFound = true;

                let urlArr = url.split('/');
                
                let vanillaUrlArr = vanillaUrl.split('/');

                if(vanillaUrl.indexOf('=') !== -1) {
                    vanillaUrlStr = vanillaUrlArr.splice(-2,1).toString();
                }
                if(url.indexOf('=') !== -1) {
                    urlStr = urlArr.splice(-2,1).toString();
                    urlStrArr = urlStr.split(';');
                }*/

                let categoryNotFound = true;
                let urlArr = url.split('/');
                if(url.indexOf('=') !== -1) {
                    urlStr = urlArr.splice(-2,1).toString();
                    urlStrArr = urlStr.split(';');
                }

                let params = items[i].querySelector('label').getAttribute('param').split('=');
                let category = params[0];
                let item = params[1];
                console.log(category +" "+item);

                //return;

                // remove item from url ---------------------

                /*if(!linkStr) {
                    let topLinks = document.querySelectorAll('.catalog-selection__list > li');
                    let itemName = this.innerText.replace(/\s*$/,"");

                    let topLinkItem = null;
                    let topLinkUrl = null;
                    for(let t = 1; t < topLinks.length; t++) {
                        let topLink = topLinks[t].querySelector('a');
                        if(topLink) {
                            if(topLink.innerText.indexOf(itemName) >= 0) {
                                topLinkUrl = topLink.href;
                            }
                        }
                    }

                    let strCategories1 = getItems(vanillaUrlStr);
                    let strCategories2 = getItems(topLinkUrl);
                    
                    console.log(strCategories1);
                    console.log(strCategories2);

                    let strCategArr = strCategories1.split(",");
                    for(let c = 0; c < strCategArr.length; c++) {
                        if(strCategories2.indexOf(strCategArr[c]) === -1) {
                            console.log(21);
                            topLinkItem = strCategArr[c];
                            newItemFound = true;
                            newItem = topLinkItem;
                            break;
                        }
                    }

                    let vanillaUrlStrArr = vanillaUrlStr.split(';');
                    for(let i = 0; i < vanillaUrlStrArr.length; i++) {
                        if(vanillaUrlStrArr[i].indexOf(newItem) >= 0) {
                            let ctg = vanillaUrlStrArr[i].split('=');
                            newCategory = ctg[0];
                            break;
                        }
                    }


                    console.log(newCategory);
                    console.log(itemName);
                    console.log(topLinkItem);


                    //console.log(this.innerText.replace(/\s*$/,""));
                }else {

                // ---------------------

                    console.log(link.href);

                    let clickLinkStr = linkStr.split('/').splice(-2,1).toString();
                    let linkFromItemArr = clickLinkStr.split(';');

                    for(let i = 0; i < linkFromItemArr.length; i++) {
                        let linkStrItem = /([a-z0-9-_]+)=([a-z0-9-_,]+)/gi.exec(linkFromItemArr[i]);
                        //let category = linkStrItem[1];
                        let goods = linkStrItem[2].split(',');

                        for(let j = 0; j < goods.length; j++) {
                            if(vanillaUrlStr.indexOf(goods[j]) <= -1) {
                                newItem = goods[j];
                                newCategory = linkStrItem[1];
                                newItemFound = true;
                                break;
                            }
                        }
                    }

                    console.log(newItem);

                }
                */
                //if(newItemFound) {
                    for(let i = 0; i < urlStrArr.length; i++) {
                        if(urlStrArr[i].indexOf(category) >= 0) {
                            categoryNotFound = false;
                            let urlCategoryArr1 = urlStrArr[i].split('=');
                            let urlCategoryArr2 = urlCategoryArr1[1].split(',');

                            if(!input.checked) {
                                urlCategoryArr2.push(item);
                                //checkItemIds.push(indexItem);
                                checkItemIds.push(item);
                            }else {
                                let index = urlCategoryArr2.indexOf(item);
                                urlCategoryArr2.splice(index,1);
                                
                                //let indexId = checkItemIds.indexOf(indexItem);
                                let indexId = checkItemIds.indexOf(item);
                                checkItemIds.splice(indexId,1);
                            }
                            if(urlCategoryArr2.length !== 0) {
                                urlCategoryArr1[1] = urlCategoryArr2.join(',');
                                urlStrArr[i] = urlCategoryArr1.join('=');
                            }else {
                                // remove category from url if category is empty
                                urlStrArr.splice(i,1);
                            }
                            break;
                        }
                    }
                    if(categoryNotFound) {
                        urlStrArr.push(category + "=" + item);
                        
                        //checkItemIds.push(indexItem);
                        checkItemIds.push(item);
                    }
                //}
                console.log(urlStrArr.join(';'));

                let slash = (urlStrArr.length > 0) ? urlStrArr.join(';') + '/' : '';
                url = urlArr.join('/') + slash;
                    //if(categoriesStr.indexOf() === -1) {

                    //}

                //}

                console.log(url);
                
                // check items on which we clicked
                input.checked = (!input.checked) ? true : false;

                console.log(checkItemIds);
                e.stopPropagation();
            });
        }

        for(let i = 0; i < items.length; i++) {
            items[i].querySelector('input').checked = false;
            let checkParam = items[i].querySelector('label').getAttribute('param');
            if(checkParam) {
                let checkParamVal = checkParam.split('=')[1];
                if(checkItemIds.indexOf(checkParamVal) >= 0) {
                    items[i].querySelector('input').checked = true;
                }
            }
        }

        console.log(checkItemIds);
        }
    }

    //setTimeout(function(){
      //generation();
    //}, 1000);
    new MutationObserver(function(mutations, observer) {
        console.log(1);
        generation();
    }).observe(document.querySelector('app-root'), {childList: true, subtree: true});

    function getItems(str) {
        if(str.toString().match(/=([a-z0-9,_\-]+)/gi) === null) return null;
        return str.toString().match(/=([a-z0-9,_\-]+)/gi).map(function(item) {
            return item.replace("=", "");
        }).join(",");
    }

    let i1 = 0;
    function getBlockCategory(elem) {
        if(elem.tagName === "DIV" && elem.className.indexOf("sidebar-block__inner") >= 0) {
            let element = elem.parentNode;
            return element.querySelector('button');
            //return a1;
            // .split('  ')[0].replace(/\s*/, '')
        }
        return getBlockCategory(elem.parentNode);
    }

})();