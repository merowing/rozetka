(function(){
    let button = document.createElement("div");
    button.setAttribute("style", "position:absolute;z-index:100;width:50px;height:30px;top:0;left:0;background-color:#00a046;");
    button.id = "injectedButton";
    document.body.appendChild(button);
})();