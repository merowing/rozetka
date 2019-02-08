(function(){
    //let strTest = `function modified() {
        function modified() {
    let div = document.querySelector('#catalog_filters_block');
    let items = div.querySelectorAll('li');
    let itemsLinksA = div.querySelectorAll('li a');
    let itemsLinksLabel = div.querySelectorAll('li label');
    let lenItemsLinks = itemsLinksA.length;

    let url = window.location.href;
    let vanilaUrl = url;
    // we must set parameter modified for the reason that sometimes data change thanks to html.history
    div.querySelector('#parameters-filter-form').setAttribute("modified", "");
    
    let index = 0;
    for(let i = 0; i < lenItemsLinks; i++) {
        itemsLinksA[i].addEventListener("click", function(e) {
            e.preventDefault();

            setInput(this);

            e.stopPropagation();
        });
        itemsLinksLabel[i].addEventListener("click", function(e) {
            e.preventDefault();
            setInput(this);
            e.stopImmediatePropagation();
        });

        items[i].setAttribute("style","margin:3px 6px 5px 5px;padding:0;");
    }

    function setInput(itm) {
        let item = itm;
        let classStr = item.querySelector('span').getAttribute('class');
        let classStrArr = [];
        let active = false;
        if(classStr.indexOf('active') === -1) {
            classStrArr = classStr.split(' ');
            classStr = classStrArr[0] + ' ' + classStrArr[1] + '-active ' + classStrArr[2];
        }else {
            classStr = classStr.replace('-active','');
            active = true; // if active, remove item from url
        }
        item.querySelector('span').setAttribute('class', classStr);

        //let categoryId = getParentId(item).getAttribute('id');
        
        // -- get category block
        let categoryStr = getCategory(item);
        
        let categoryLink = decodeURIComponent(categoryStr.href);
        let categoryName = categoryStr.name;

        let categoryId = [];
        categoryId[0] = categoryName.split('_')[0];
        
        let reg = new RegExp(categoryId[0] + "=([a-z,\\-0-9]+)", "gi");
        let values = reg.exec(categoryLink)[1];
        
        let valuesArr = values.split(',');
        let valuesUrlArr = "";
        
        let valuesVanilaUrl = "";
        let valuesVanilaUrlArr = "";
        if(vanilaUrl.indexOf(categoryId[0]) !== -1) {
            regVanila = new RegExp(categoryId[0] + "=([a-z,\\-0-9]+)", "gi");
            valuesVanilaUrl = regVanila.exec(vanilaUrl)[1];
            valuesVanilaUrlArr = valuesVanilaUrl.split(',');
        }

        if(url.indexOf(categoryId[0]) !== -1) {
            reg = new RegExp(categoryId[0] + "=([a-z,\\-0-9]+)", "gi");
            console.log("url: " + categoryId[0] + " - " + url);
            let valuesUrl = reg.exec(url)[1];

            
            valuesUrlArr = valuesUrl.split(',');

            //console.log("category:" + categoryId[0] + " - " + vanilaUrl.indexOf(categoryId[0]));
            if(vanilaUrl.indexOf(categoryId[0]) !== -1) {
                

                if(valuesArr.length < valuesVanilaUrlArr.length) {
                    //if(active) {
                        /*let indCategoryStart = url.indexOf(categoryId[0]);
                        let indCategoryFinish = url.indexOf(";",categoryId[0].length);
                        let replaceStr = categoryId[0] + "=" + values;
                        url = url.substr(0, indCategoryStart) + replaceStr + url.substr(indCategoryFinish);*/

                        for(let n = 0; n < valuesVanilaUrlArr.length; n++) {
                            for(let n1 = 0; n1 < valuesArr.length; n1++) {
                                if(valuesVanilaUrlArr[n] == valuesArr[n1]) {
                                    categoryId[1] = "";
                                    break;
                                }

                                categoryId[1] = valuesVanilaUrlArr[n];
                            }
                            if(categoryId[1]) break;
                        }
                        console.log("vanila: " + categoryId[1]);

                    //}else {

                    //}
                }else {
                    for(let q = 0; q < valuesArr.length; q++) {
                        for(let q1 = 0; q1 < valuesVanilaUrlArr.length; q1++) {
                            if(valuesArr[q] == valuesVanilaUrlArr[q1]) {
                                categoryId[1] = "";
                                break;
                            }
                            categoryId[1] = valuesArr[q];
                        }
                        if(categoryId[1]) break;
                    }
                }
            }else {

            //if(valuesArr.length > valuesVanilaUrlArr.length) {
                if(active) {
                    categoryId[1] = valuesArr[0];
                }else {
                    //let found = false;
                    for(let q = 0; q < valuesArr.length; q++) {
                        //found = false;
                        for(let q1 = 0; q1 < valuesUrlArr.length; q1++) {
                            if(valuesArr[q] == valuesUrlArr[q1]) {
                                //found = true;
                                categoryId[1] = "";
                                break;
                            }

                            //if(!found && q1 == valuesUrlArr.length - 1) {
                                categoryId[1] = valuesArr[q];
                            //}
                        }
                        if(categoryId[1]) break;
                    }
                }
            }
        }else {
            if(valuesArr.length == 1) {
                categoryId[1] = values;
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
        }
        console.log("category:" + categoryId[1]);

        if(categoryId[0] === 'seller') {
            switch(categoryId[1]) {
                case "1":
                    categoryId[1] = "rozetka";
                    break;
                case "2":
                    categoryId[1] = "other";
            }
        }
        
        console.log(categoryId);
        
        // -- end get category block
        
        // url.match(/\/[a-z=0-9;,\-]+\//gi)[1].replace(/\//g,'');
        let str = url.match(/\/[a-z=0-9;,\-]+\//gi);
        let data = [];
        let same = false; // if category is same
        if(str.length > 1) {
            str = str[1].replace(/\//g,'');
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
            console.log(str);
            
            let t = 0;
            url = url.replace(/\/[a-z=0-9;,\-]+\//ig, function(match) {
                if(t == 1) return "/" + str.join(';');// + "/";
                t++;
                return match;
            });
            if(str.length > 0) url += "/";

        }else {
            url += categoryId.join("=") + "/"
        }

        console.log(url);

    }
    }
    modified();
    
    function getCategory(item) {
        if(item.tagName === "LABEL") {
            return item.querySelector('a');
        }
        return item;
    }

    new MutationObserver(function(mutations, observer) {
        // Do something here
    console.log(1);
    modified();
        // Stop observing if needed:
        //observer.disconnect();
    }).observe(document.querySelector('div#catalog_filters_block'), {childList: true});
    //`;

    /*let scriptBody = document.createElement("script");
    scriptBody.innerHTML = strTest;
    document.body.appendChild(scriptBody);*/

})();