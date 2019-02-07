(function(){
    //let strTest = `function modified() {
        function modified() {
    let div = document.querySelector('#catalog_filters_block');
    let items = div.querySelectorAll('li');
    let itemsLinksA = div.querySelectorAll('li a');
    let itemsLinksLabel = div.querySelectorAll('li label');
    let lenItemsLinks = itemsLinksA.length;

    let url = window.location.href;
    // we must set parameter modified for the reason that sometimes data change thanks to html.history
    div.querySelector('#parameters-filter-form').setAttribute("modified", "");

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

        let categoryId = getParentId(item).getAttribute('id');
        categoryId = categoryId.split('_');
        if(categoryId[1] === 'seller') {
            switch(categoryId[2]) {
                case "1":
                    categoryId[2] = "rozetka";
                    break;
                case "2":
                    categoryId[2] = "other";
            }
        }
        

        console.log(categoryId);
        
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

                if(key === categoryId[1]) {
                    same = true;
                    let valArr = val.split(',');
                    if(!active) {
                        valArr.push(categoryId[2]);
                    }else {
                        if(valArr.length > 1) {
                            for(let l =0; l < valArr.length; l++) {
                                if(valArr[l] == categoryId[2]) {
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
                str.push(categoryIdNew.join('='));
            }
            console.log(str);
            
            let t = 0;
            url = url.replace(/\/[a-z=0-9;,\-]+\//ig, function(match) {
                if(t == 1) return "/" + str.join(';') + "/";
                t++;
                return match;
            });

        }else {
            url += str.join(';') + "/"
        }
        console.log(url);

    }
    }
    modified();
    
    function getParentId(item) {
        if(item.parentNode.tagName != "LI") {
            return getParentId(item.parentNode);
        }
        return item.parentNode;
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