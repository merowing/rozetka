(function(){
    
    let url = "";
    let vanilaUrl = "";
    let checkedItems = [];
    let div = document.querySelector('#catalog_filters_block');

    function modified() {
    let items = div.querySelectorAll('li');
    let itemsLinksA = div.querySelectorAll('li a');
    let itemsLinksLabel = div.querySelectorAll('li label');
    let lenItemsLinks = itemsLinksA.length;

    let left = 0;
    let top = 0;
    
    url = window.location.href;
    vanilaUrl = url;
    checkedItems = [];
    
    let index = 0;
    for(let i = 0; i < lenItemsLinks; i++) {
        itemsLinksA[i].addEventListener("click", function(e) {
            e.preventDefault();

            setInput(this, i);

            setButtonPosition(i);

            e.stopPropagation();
        });
        itemsLinksLabel[i].addEventListener("click", function(e) {
            e.preventDefault();
            setInput(this, i);
            setButtonPosition(i);
            e.stopImmediatePropagation();
        });

        items[i].setAttribute("style","margin:3px 6px 5px 5px;padding:0;");
        
        if(itemsLinksA[i].querySelector('span').getAttribute('class').indexOf('active') >= 0) {
            checkedItems.push(i);
        }
    }

    function setInput(itm, itemIndex) {
        let item = itm;
        let classStr = item.querySelector('span').getAttribute('class');
        let classStrArr = [];
        let active = false;
        if(classStr.indexOf('active') === -1) {
            classStrArr = classStr.split(' ');
            classStr = classStrArr[0] + ' ' + classStrArr[1] + '-active ' + classStrArr[2];
            
            checkedItems.push(itemIndex);
        }else {
            classStr = classStr.replace('-active','');
            active = true; // if active, remove item from url
            
            let indChecked = checkedItems.indexOf(itemIndex);
            if(indChecked !== -1) {
                checkedItems.splice(indChecked, 1);
            }
        }
        item.querySelector('span').setAttribute('class', classStr);
        // -- get category block
        let categoryStr = getCategoryName(item);
        let categoryLinkStr = getCategoryLink(item);

        let categoryLink = decodeURIComponent(categoryLinkStr.href);
        //let categoryName = categoryStr.name;
        let categoryName = categoryStr.getAttribute("param");
    console.log(categoryName);
    console.log(categoryStr.param);
        let categoryId = [];
        categoryId[0] = categoryName.split('_')[0];
        
        let reg = new RegExp(categoryId[0] + "=([a-z,\\-0-9]+)", "gi");
        let values = "";
        if(categoryLink.indexOf(categoryId[0]) !== -1) {
            values = reg.exec(categoryLink)[1];
        }else {
            values = reg.exec(vanilaUrl)[1];
        }
        
        let valuesArr = values.split(',');
        let valuesUrlArr = [];
        
        let valuesVanilaUrl = "";
        let valuesVanilaUrlArr = [];
        if(vanilaUrl.indexOf(categoryId[0]) !== -1) {
            regVanila = new RegExp(categoryId[0] + "=([a-z,\\-0-9]+)", "gi");
            valuesVanilaUrl = regVanila.exec(vanilaUrl)[1];
            valuesVanilaUrlArr = valuesVanilaUrl.split(',');
        }

        if(url.indexOf(categoryId[0]) !== -1) {
            reg = new RegExp(categoryId[0] + "=([a-z,\\-0-9]+)", "gi");
            
            let valuesUrl = reg.exec(url)[1];

            valuesUrlArr = valuesUrl.split(',');

            if(vanilaUrl.indexOf(categoryId[0]) !== -1) {
                categoryId[1] = valuesArr.filter(x => !valuesVanilaUrlArr.includes(x)
                    ).concat(
                        valuesVanilaUrlArr.filter(x => !valuesArr.includes(x))
                    ).join("");
                
            }else {

                if(active) {
                    categoryId[1] = valuesArr[0];
                }else {
                    for(let q = 0; q < valuesArr.length; q++) {
                        for(let q1 = 0; q1 < valuesUrlArr.length; q1++) {
                            if(valuesArr[q] == valuesUrlArr[q1]) {
                                categoryId[1] = "";
                                break;
                            }
                            categoryId[1] = valuesArr[q];
                        }
                        if(categoryId[1]) break;
                    }
                }
            }
        }else {
            // found this solution: https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
            // array1 > array2 and vice versa
            // filter1 looking for diff between two array and concat with filter2 when arrays vice versa
            // use arrows functions
            let val = valuesArr.filter(x => !valuesVanilaUrlArr.includes(x)
                ).concat(
                    valuesVanilaUrlArr.filter(x => !valuesArr.includes(x))
                ).join("");
            categoryId[1] = val;
            if(val == "" && valuesArr.length == 1) categoryId[1] = valuesArr[0];

            // old solution
            /*if(valuesArr.length < valuesVanilaUrlArr.length) {
                let temp  = valuesArr;
                valuesArr = valuesVanilaUrlArr;
                valuesVanilaUrlArr = temp;
            }

            for(let q = 0; q < valuesArr.length; q++) {
                for(let q1 = 0; q1 < valuesVanilaUrlArr.length; q1++) {
                    if(valuesArr[q] == valuesVanilaUrlArr[q1]) {
                        categoryId[1] = "";
                        break;
                    }
                    categoryId[1] = valuesArr[q];
                }
                if(categoryId[1]) break;
            }*/
        }
        
        // -- end get category block
        
        let str = url.match(/\/[a-z\-0-9]+=([a-z=0-9;,\-]+)\//gi);//url.match(/\/[a-z=0-9;,\-]+\//gi);
        let data = [];
        let same = false; // if category is same
        let strRegexp = new RegExp(/\/[a-z\-0-9]+=([a-z=0-9;,\-]+)\//gi);
        if(strRegexp.test(url)) {
            str = str[0].replace(/\//g,'');//str = str[1].replace(/\//g,'');
            str = str.split(';');
            for(let i = 0; i < str.length; i++) {
                data = str[i].split('=');
                let key = data[0];
                let val = data[1];

                if(key === categoryId[0]) {
                    same = true;
                    let valArr = val.split(',');
                    if(!active) {
                        valArr.push(categoryId[1]);
                    }else {
                        if(valArr.length > 1) {
                            for(let l =0; l < valArr.length; l++) {
                                if(valArr[l] == categoryId[1]) {
                                    valArr.splice(l, 1);
                                }
                            }
                        }else {
                            str.splice(i,1);
                            i--;
                            continue;
                        }
                    }
                    data[1] = valArr.join(',');
                }
                str[i] = data.join('=');
            }
            if(!same) {
                // use slice instead of shift, because shift more slower than slice
                let categoryIdNew = categoryId.slice(1, categoryId.length); // remove first element, which is not needed
                str.push(categoryId.join('='));
            }
            
            let t = 0;
            let strReplace = str.join(';');
            if(str.length !== 0) strReplace += "/";
            url = url.replace(/[a-z0-9\-]+=[a-z=0-9;,\-]+\//ig, strReplace);

            /*url = url.replace(/\/[a-z0-9\-]+=[a-z=0-9;,\-]+\//ig, function(match) {
                if(t == 1) return "/" + str.join(';');// + "/";
                t++;
                return match;
            });*/
            
            //if(str.length > 0) url += "/";
        }else {
            url += categoryId.join("=") + "/"
        }
        console.log(url);

    }
    }
    modified();
    
    function getCategoryName(item) {
        if(item.tagName !== "DIV" | item.getAttribute("param") === null) {
            return getCategoryName(item.parentNode);
        }
        return item;
    }
    function getCategoryLink(item) {
        if(item.tagName === "LABEL") {
            return item.querySelector('a');
        }
        return item;
    }

    new MutationObserver(function(mutations, observer) {
        modified();
    }).observe(document.querySelector('div#catalog_filters_block'), {childList: true});

    // button block
    let button = document.getElementById("injectedButton");
    button.addEventListener("click", function() {
        window.location.href = url;
    });

    function setButtonPosition(elemIndex) {
        let elem = div.querySelectorAll('li label')[elemIndex];
        if(checkedItems.indexOf(elemIndex) === -1 && checkedItems.length >= 1) {
            elem = div.querySelectorAll('li label')[checkedItems[checkedItems.length - 1]];
        }
        let l = 0;
        if(elem.querySelectorAll('i').length > 1) {
            l = 1;
        }
        
        let left = elem.querySelectorAll('i')[l].getBoundingClientRect().left;
        let top = elem.getBoundingClientRect().top;
        let width = elem.querySelectorAll('i')[l].getBoundingClientRect().width;
        let height = elem.getBoundingClientRect().height;

        let scrollTop = window.pageYOffset;
        let scrollLeft = window.pageXOffset;

        button.style.left = left + width + scrollLeft + 10 + "px";
        button.style.top = (top - (button.offsetHeight - height)/2) + scrollTop + "px";

        button.style.visibility = "visible";
        if(!checkedItems.length) {
            button.style.visibility = "hidden";
        }


    }

})();