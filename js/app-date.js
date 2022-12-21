let dateAr = new Date();
const arrDate = document.querySelector('#arrival-date');
arrDate.value = dateAr.toISOString().split('T')[0]; // устанавливаем значение ввода даты прибытия (сегодняшнее число)
arrDate.min = dateAr.toISOString().split('T')[0]; // устанавливаем минимальное допустимое значение ввода даты прибытия (сегодняшнее число)

let dateDep = new Date(new Date().setDate(dateAr.getDate()+1));
const depDate = document.querySelector('#departure-date');
depDate.value = dateDep.toISOString().split('T')[0]; // устанавливаем значение ввода даты отъезда (следующее число)
depDate.min = dateAr.toISOString().split('T')[0]; // устанавливаем минимальное допустимое значение ввода даты отъезда (следующее число)

localStorage.setItem("dateAr", dateAr.toISOString().split('T')[0].toString());
localStorage.setItem("dateDep", dateDep.toISOString().split('T')[0].toString()); // заполняем локальное хранилище датами


arrDate.onchange = function changeArrDate() { // изменение даты прибытия
    let dateVal = arrDate.value;
    localStorage.setItem("dateAr" , dateVal.toString());
    localStorage.setItem("dateDep" , dateVal.toString()); // дата выезда не должна быть меньше дата приезда
    depDate.value = dateVal;
}

depDate.onchange = function changeDepDate() { // изменение даты выезда
    if(arrDate.value > depDate.value) { // проверка дат
        depDate.value = arrDate.value;
    }

    localStorage.setItem("dateDep" , depDate.value.toString());
}

const checkBut = document.querySelector('.lng-check');
checkBut.addEventListener('click', checkAvailability);

function checkAvailability() { // показать наличие комнат
    window.open("price.html", target="_self");
}