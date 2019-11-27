(function(){
    let url = window.location.href;
    let checkItemIds = [];

    // ------------
    let str = document.querySelector("#rz-client-state").innerText;
    str = str.replace(/&q;/g,'"');
    str = str.replace(/&a;/g,'&');
    
    let start = str.match(/"options/).index;
    let end = str.indexOf(",\"chosen\"", start);
    let json = JSON.parse("{" + str.substr(start,end-start) + "}");
    console.log(json);

    let options = json.options;
    let keys = Object.keys(options);
    let skip = ["price", "tegi"]; // option_name
    let skipFound = [];
    let categoriesObj = {};
    categoriesObj.items = [];
    {
        [{
            title: "",
            category:"",
            id:"",
            name:""
        }]
    }
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
                optionsObj = {};
                optionsObj.title = optionTitle;
                optionsObj.category = optionId;
                optionsObj.id = values[j].option_value_name;
                optionsObj.name = values[j].option_value_title;
                categoriesObj.items.push(optionsObj);
            }
        }
    }
    console.log(categoriesObj);
    // -------------

    function generation() {
        //return;
        let sidebar = document.querySelector('aside.sidebar');
        let items = sidebar.querySelectorAll('li.checkbox-filter__item');

        // ----------

        // set new attribute param for all items
        for(let i = 0; i < items.length; i++) {
            let getCategory = getBlockCategory(items[i]);
            let getCategoryStr = getCategory.firstChild.nodeValue.replace(/^\s+|\s+$/g,'');
            //console.log(getCategory);
            for(let j = 0; j < categoriesObj.items.length; j++) {
                let categTitle = categoriesObj.items[j].title; // name of block
                let categ = categoriesObj.items[j].category; // name of category
                let valueId = categoriesObj.items[j].id; // id of item
                let valueName = categoriesObj.items[j].name; // name of item

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
        let vanillaUrl = window.location.href;

        let label, input, link;
        let indexItem;

        let urlStr = "";
        let urlStrArr = [];
        let vanillaUrlStr = "";

        for(let i = 0; i < len; i++) {
            label = items[i].querySelector('label');

            if(label.getAttribute('click')) continue;
            if(items[i].querySelector('input').checked) {
                if(checkItemIds.indexOf(i) === -1)
                checkItemIds.push(i);
            }

            // set label event click on label tags
            label.setAttribute("click",true);
            label.addEventListener('click', function(e) {
                e.preventDefault();
                
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

                let params = this.getAttribute('param').split('=');
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
                
                //if(newItemFound) {
                    for(let i = 0; i < urlStrArr.length; i++) {
                        if(urlStrArr[i].indexOf(newCategory) >= 0) {
                            categoryNotFound = false;
                            let urlCategoryArr1 = urlStrArr[i].split('=');
                            let urlCategoryArr2 = urlCategoryArr1[1].split(',');

                            if(!input.checked) {
                                urlCategoryArr2.push(newItem);
                                checkItemIds.push(indexItem);
                            }else {
                                let index = urlCategoryArr2.indexOf(newItem);
                                urlCategoryArr2.splice(index,1);

                                let indexId = checkItemIds.indexOf(indexItem);
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
                        urlStrArr.push(newCategory + "=" + newItem);
                    }
                //}
                console.log(urlStrArr.join(';'));

                let slash = (urlStrArr.length > 0) ? urlStrArr.join(';') + '/' : '';
                url = urlArr.join('/') + slash;
                    //if(categoriesStr.indexOf() === -1) {

                    //}

                //}

                console.log(url);
                */
                // check items on which we clicked
                input.checked = (!input.checked) ? true : false;
                
                e.stopPropagation();
            });
        }

        for(let i = 0; i < items.length; i++) {
            items[i].querySelector('input').checked = false;
            if(checkItemIds.indexOf(i) >= 0) {
                items[i].querySelector('input').checked = true;
            }
        }

        console.log(checkItemIds);
    }

    //setTimeout(function(){
      //generation();
    //}, 1000);
    new MutationObserver(function(mutations, observer) {
        console.log(1);
        generation();
    }).observe(document.querySelector('app-root'), {childList: true, subtree: true});

    function getItems(str) {
        return str.toString().match(/=([a-z0-9,_]+)/gi).map(function(item) {
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