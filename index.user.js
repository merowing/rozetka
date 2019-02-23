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

        url = window.location.href;
        vanilaUrl = url;
        checkedItems = [];
    		
      	let clickFunc = function(element, i) {
            element.addEventListener("click", function(e) {
                e.preventDefault();
                setInput(this, i);
                setButtonPosition(i);
                e.stopPropagation();
            }, false);
        };
      
        for(let i = 0; i < lenItemsLinks; i++) {
            clickFunc(itemsLinksA[i], i);
            clickFunc(itemsLinksLabel[i], i);

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
            let categoryName = categoryStr.getAttribute("param");

            let categoryId = [];
            categoryId[0] = categoryName;
            
            let reg = new RegExp(categoryId[0] + "=([a-z,\\-0-9_]+)", "gi");
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
                let regVanila = new RegExp(categoryId[0] + "=([a-z,\\-0-9_]+)", "gi");
                valuesVanilaUrl = regVanila.exec(vanilaUrl)[1];
                valuesVanilaUrlArr = valuesVanilaUrl.split(',');
            }
            
            if(url.indexOf(categoryId[0]) !== -1) {
                reg = new RegExp(categoryId[0] + "=([a-z,\\-0-9_]+)", "gi");
                
                let valuesUrl = reg.exec(url)[1];

                valuesUrlArr = valuesUrl.split(',');
                
                if(vanilaUrl.indexOf(categoryId[0]) !== -1) {
                    categoryId[1] = valuesArr.filter(x => !valuesVanilaUrlArr.includes(x)
                        ).concat(
                            valuesVanilaUrlArr.filter(x => !valuesArr.includes(x))
                        ).join("");
                        if(categoryId[1] == "" && valuesArr.length == 1) categoryId[1] = valuesArr[0];
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
            }
            
            // -- end get category block
            
            let str = url.match(/\/[a-z\-0-9_]+=([a-z=0-9;,\-_]+)\//gi);
            let data = [];
            let same = false; // if category the same
            let strRegexp = new RegExp(/\/[a-z\-0-9_]+=([a-z=0-9;,\-_]+)\//gi);
            
            if(strRegexp.test(url)) {
                str = str[0].replace(/\//g,'');
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
                    str.push(categoryId.join('='));
                }
                
                let strReplace = str.join(';');
                if(str.length !== 0) strReplace += "/";
                url = url.replace(/[a-z0-9\-_]+=[a-z=0-9;,\-_]+\//ig, strReplace);
            }else {
                url += categoryId.join("=") + "/";
            }
        }
    }
    // don't run our function if the div block is not found which we are looking for
    if(div !== null) {
        modified();

        // sometimes html5.history works and update catalog filters
        // we must assign click events again for each items
        // MutationOserverver automatically check if catalog change and run our modified function
        new MutationObserver(function(mutations, observer) {
            modified();
        }).observe(document.querySelector('div#catalog_filters_block'), {childList: true});
    }
    
    // this function returns category name when we click on item
    function getCategoryName(item) {
        if(item.tagName !== "DIV" || item.getAttribute("param") === null) {
            return getCategoryName(item.parentNode);
        }
        return item;
    }
    // this function returns the element that we click on
    function getCategoryLink(item) {
        if(item.tagName === "LABEL") {
            return item.querySelector('a');
        }
        return item;
    }

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