(function(){

    let url = window.location.href;
    let checkItemIds = [];
    let urlCategoryId = 0;
    let categoriesObj = {};
    let injectedButton = document.querySelector("#injectedButton");

    function pageLoad(json) {
        json = JSON.parse(json);
        options = json.data.options;
            
        if(json) {
            let keys = Object.keys(options);
            let skip = ["price", "tegi"]; // option_name | skip blocks
            let skipFound = [];
            categoriesObj = {};
            categoriesObj.items = [];
            
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
            // -------------
        }
    }

    let buttonClicked = false;
    function generation() {

        if(injectedButtonClick) {
            injectedButtonClick = false;
            injectedButton.style.visibility = "hidden";
        }
        // ----------------
        // when we clicked on the button "Сбросить"
        // clear url and checkeditems array
        let button = document.querySelector('.catalog-selection__link.catalog-selection__link_type_reset');
        if(button)
        button.addEventListener("click",function(e){
            buttonClicked = true;
        });
        
        if(window.location.href.indexOf('=') === -1 && buttonClicked) {
            checkItemIds = [];
            url = window.location.href;
            buttonClicked = false;
        }
        // ----------------

        if(!categoriesObj.items) return;
        
        let sidebar = document.querySelector('aside.sidebar');
        if(sidebar) {
            let items = sidebar.querySelectorAll('.filter_layout_sidebar > ul li > a');
            
            // show first sidebar block because he has hidden sometimes
            sidebar.querySelector('div').removeAttribute('style');

            // ----------

            // set new attribute param for all items
            for(let i = 0; i < items.length; i++) {
                let getCategory = getBlockCategory(items[i]);
                let getCategoryStr = getCategory.firstChild.nodeValue.replace(/^\s+|\s+$/g,'');
                let objItems = categoriesObj.items;
                for(let j = 0; j < objItems.length; j++) {
                    let categTitle = objItems[j].title; // name of block
                    let categ = objItems[j].category; // name of category
                    let valueId = objItems[j].id; // id of item
                    let valueName = objItems[j].name; // name of item

                    if(items[i].querySelector('input')) {
                        if(items[i].querySelector('input').id === valueName && getCategoryStr === categTitle) {
                            items[i].querySelector('label').setAttribute("param", categ+"="+valueId);
                        }
                    }else {
                        if(items[i].innerText === valueName && getCategoryStr === categTitle) {
                            items[i].setAttribute("param", categ+"="+valueId);
                        }
                    }
                }
            }
            // ----------

            let len = items.length;
            let label, input;
            let urlStr = "";
            let urlStrArr = [];

            // -----------
        
            // якщо ми змінили метод сортування через select, перезаписуємо url
            let select = document.querySelector('.catalog-settings select');
            select.onchange = function() {
                url = window.location.href;
            };

            // -----------

            let topClearItems = document.querySelector('ul.catalog-selection__list');
            let test = function(e) {
                injectedButton.style.visibility = "hidden";
                url = window.location.href;
            };
            topClearItems.removeEventListener('click', test, false);
            topClearItems.addEventListener('click', test, false);

            for(let i = 0; i < len; i++) {

                // hide empty items --------------

                if(items[i].getAttribute('class').indexOf('disabled') >= 0 && !items[i].getAttribute("click")) {
                    if(items[i].querySelector('input')) {
                        if(!items[i].querySelector('input').checked && (!/\([0-9]+\)/.test(items[i].querySelector('label').textContent) || !items[i].getAttribute("href"))) {
                            items[i].parentElement.style.display = "none";
                        }
                    }else {
                        if(!items[i].getAttribute("visible"))
                        items[i].parentElement.style.display = "none";
                    }
                }else {
                    items[i].removeAttribute('class');
                    items[i].style.color = "#333";
                    if(items[i].querySelector('input')) {
                        items[i].setAttribute('class', "checkbox-filter__link checkbox-filter__link_state_disabled");
                        
                        if(items[i].querySelector('label > span')) {
                            items[i].querySelector('label > span').style.visibility = "visible";
                        }
                    }else {
                        items[i].setAttribute('class', "tile-filter__link tile-filter__link_state_disabled");
                        items[i].setAttribute("visible", true);
                    }
                }

                // -------------------------------
                
                label = items[i];

                if(label.getAttribute('click')) continue;

                let checkItemParam = null;
                if(items[i].querySelector('label')) {
                    checkItemParam = items[i].querySelector('label').getAttribute('param');
                }else {
                    checkItemParam = items[i].getAttribute('param');
                }
                if(checkItemParam) {
                    let checkItemParamStr = checkItemParam.split('=')[1];
                    let indParam = checkItemIds.indexOf(checkItemParamStr);

                    let chd = false;
                    let urlItems = getItems(url);
                    chd = urlItems.includes(checkItemParamStr);

                    if(chd && indParam === -1) {
                        checkItemIds.push(checkItemParamStr);
                    }

                    if(urlItems) {
                        for(let j = 0; j < checkItemIds.length; j++) {
                            if(!urlItems.includes(checkItemIds[j])) {
                                checkItemIds.splice(j, 1);
                                j--;
                            }
                        }
                    }
                }

                // set label event click on label tags
                if(!label.parentNode.getAttribute("style"))
                label.setAttribute("click",true);
            
                label.parentElement.addEventListener('click', function(e) {
                    e.preventDefault();

                    input = items[i].querySelector('input');
                    indexItem = i;

                    let categoryNotFound = true;
                    let urlArr = url.split('/');
                    if(url.indexOf('=') !== -1) {
                        urlStr = urlArr.splice(-2,1).toString();
                        urlStrArr = urlStr.split(';');
                    }

                    let params = null;
                    if(items[i].querySelector('label')) {
                        params = items[i].querySelector('label').getAttribute('param').split('=');
                    }else {
                        params = items[i].getAttribute('param').split('=');
                    }
                    let category = params[0];
                    let item = params[1];

                    for(let j = 0; j < urlStrArr.length; j++) {
                        if(urlStrArr[j].indexOf(category) >= 0) {
                            categoryNotFound = false;
                            let urlCategoryArr1 = urlStrArr[j].split('=');
                            let urlCategoryArr2 = urlCategoryArr1[1].split(',');

                            let addToArr = false;
                            
                            if(input) {
                                addToArr = input.checked;
                            }else {
                                addToArr = items[i].classList.contains("active");
                            }
                            
                            if(!addToArr) {
                                urlCategoryArr2.push(item);
                                checkItemIds.push(item);
                            }else {
                                let index = urlCategoryArr2.indexOf(item);
                                urlCategoryArr2.splice(index,1);
                                
                                let indexId = checkItemIds.indexOf(item);
                                checkItemIds.splice(indexId,1);
                            }
                            if(urlCategoryArr2.length !== 0) {
                                urlCategoryArr1[1] = urlCategoryArr2.join(',');
                                urlStrArr[j] = urlCategoryArr1.join('=');
                            }else {
                                // remove category from url if category is empty
                                urlStrArr.splice(j,1);
                            }
                            
                            break;
                        }
                    }
                    if(categoryNotFound) {
                        urlStrArr.push(category + "=" + item);
                        checkItemIds.push(item);
                    }

                    let slash = (urlStrArr.length > 0) ? urlStrArr.join(';') + '/' : '';
                    url = urlArr.join('/') + slash;

                    // --------------
                    
                    let urlParams = {
                        category: /\/c([0-9]+)\//.exec(window.location.href)[1],
                        strParams: urlStrArr.join("&")
                    };
                    chrome.runtime.sendMessage({type:'goods', obj:urlParams},function(response) {
                        let goodStr = "товарів";
                        if(response <= 4) goodStr = "товари";
                        if(response === 1) goodStr = "товар";
                        injectedButton.querySelector("span").innerText = (parseInt(response) <= 0) ? "Не знайдено" : response + " " + goodStr;
                        injectedButton.style.visibility = 'visible';
                    });

                    // --------------

                    // check items on which we clicked
                    if(items[i].querySelector('input')) {
                        input.checked = (!input.checked) ? true : false;
                    }else {
                        if(items[i].classList.contains("active")) {
                            items[i].classList.toggle("active");
                            items[i].style.color = "#333";
                        }else {
                            items[i].classList.toggle("active");
                            items[i].removeAttribute("style");
                        }
                    }

                    // ------------------
                    //injectedButton.style.visibility = 'visible';
                    let t = this.getBoundingClientRect().top + this.offsetHeight/2 - injectedButton.offsetHeight/2 + window.scrollY;
                    let l = sidebar.offsetWidth + sidebar.getBoundingClientRect().left - 10;

                    // for items which have input tag
                    if(items[i].querySelector('input')) {
                        l = this.offsetWidth + this.getBoundingClientRect().left - 10;
                    }
                    injectedButton.style.top = t + "px";
                    injectedButton.style.left = l + "px";
                    // ------------------

                    e.stopPropagation();
                });
            }

            for(let i = 0; i < items.length; i++) {
                if(items[i].querySelector('input')) {
                    items[i].querySelector('input').checked = false;
                }
                let checkParam = (items[i].querySelector('input')) ? items[i].querySelector('label').getAttribute('param') : items[i].getAttribute('param');
                if(checkParam) {
                    let checkParamVal = checkParam.split('=')[1];
                    if(checkItemIds.indexOf(checkParamVal) >= 0) {
                        if(items[i].querySelector('input')) {
                            items[i].querySelector('input').checked = true;
                        }else {
                            if(!items[i].classList.contains("active")) {
                                items[i].removeAttribute("style");
                                items[i].classList.add("active");
                            }
                        }
                    }
                }
            }
        }
    }

    let injectedButtonClick = false;
    injectedButton.addEventListener("click", function() {
        injectedButtonClick = true;
        window.open(url, "_self");
    });

    // style for items when we hover on them
    let styleStr = document.createElement("style");
    styleStr.innerHTML = `
        li.checkbox-filter__item,
        li.tile-filter__item {
            cursor: pointer;
            transition: all .2s ease;
        }
        li.checkbox-filter__item:hover > a,
        li.tile-filter__item:hover > a {
            background-color:#f4faf6;
        }
        li.checkbox-filter__item:hover > a.checkbox-filter__link.checkbox-filter__link_state_disabled label:before,
        li.tile-filter__item:hover > a {
            border-color:#221f1f;
        }
        .tile-filter__link.tile-filter__link_state_disabled.active {
            background-color:#00a046;
            border-color:#00a046;
            color:#fff;
        }
        `;
    document.getElementsByTagName("body")[0].appendChild(styleStr);

    if(document.querySelector('app-root')) {
        new MutationObserver(function(mutations, observer) {
            if(!/\/c([0-9]+)\//.exec(window.location.href)) return;
            
            // when we move to another page, parse json items parameters again
            let currentCategoryId = /\/c([0-9]+)\//.exec(window.location.href)[1];
            let currentParams = window.location.pathname.split("/").slice(3,-1).toString().replace(/;/g, "&");
            if(urlCategoryId !== currentCategoryId && !currentParams) {
                checkItemIds = [];
                url = window.location.href;
                injectedButton.style.visibility = 'hidden';
    
                urlCategoryId = currentCategoryId;
            }
            
            let paramStrObj = {
                'id': currentCategoryId,
                'params': currentParams
            };

            if(typeof chrome.app.isInstalled !== 'undefined')
            chrome.runtime.sendMessage({type:'loaddata', urlStrObj:paramStrObj},function(response) {
                pageLoad(response);
                generation();
            });

        }).observe(document.querySelector('app-root'), {childList: true, subtree: true});
    }

    function getItems(str) {
        if(str.toString().match(/=([a-z0-9,_\-]+)/gi) === null) return [];
        return str.toString().match(/=([a-z0-9,_\-]+)/gi).map(function(item) {
            return item.replace("=", "").split(',');
        }).flat(1);
    }

    function getBlockCategory(elem) {
        if(elem.tagName === "DIV" && elem.className.indexOf("sidebar-block__inner") >= 0) {
            let element = elem.parentNode;
            return element.querySelector('button');
        }
        return getBlockCategory(elem.parentNode);
    }

})();