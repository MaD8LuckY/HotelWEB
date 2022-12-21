const select = document.querySelector('select');
const option = document.querySelector('option');
select.value = localStorage.getItem("sel");

if(localStorage.getItem("sel") === null) { // устанавливаем начальный язык
    localStorage.setItem("sel", "ru");
    document.querySelector("#start_lang").select = "selected";
}

select.addEventListener('change', changeLanguage);

function changeLanguage() { // изменение языка
    let lang = select.value;
    localStorage.setItem("sel",lang.toString());

    for (let key in langArr) {
        let block = document.querySelector('.lng-' + key);

        if(block !== null) 
            block.innerHTML = langArr[key][lang];
    }
}

function setLanguage() {
    let lang = localStorage.getItem("sel");

    for (let key in langArr) {
        let block = document.querySelector('.lng-' + key);
        
        if(block !== null) 
            block.innerHTML = langArr[key][lang];
    }
}

window.onload = function() { // загрузка страницы
    setLanguage();
}