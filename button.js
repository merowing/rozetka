(function(){
    let styleString = `
        background-color: #00a046;
        color: white;
        cursor: pointer;
        visibility: hidden;
        font: normal 12px Arial;
        height: 35px;
        left: 0;
        line-height: 35px;
        padding: 0 16px;
        position: absolute;
        top: 0;
        z-index: 99;
        transition: background-color 0.2s ease-in-out;
        `;

    let button = document.createElement("div");
    button.style.cssText = styleString;
    button.id = "injectedButton";
    button.innerHTML = "<span>Показати</span>";
    document.body.appendChild(button);
})();