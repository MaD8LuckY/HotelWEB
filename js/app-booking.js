const typesRooms = {
    "superiors" : {
        "price" : 3800,
        "totalprice" : 0,
        "value" : 0,
        "place" : 2,
    },
    "studios" : {
        "price" : 4500,
        "totalprice" : 0,
        "value" : 0,
        "place" : 2,
    },
    "deluxes" : {
        "price" : 9000,
        "totalprice" : 0,
        "value" : 0,
        "place" : 3, 
    },
    "bisinessrooms" : {
        "price" : 5500,
        "totalprice" : 0,
        "value" : 0,
        "place" : 2, 
    },
    "honeymoonrooms" : {
        "price" : 4900,
        "totalprice" : 0,
        "value" : 0,
        "place" : 2,
    }
};

const roomDBJSON = JSON.parse(localStorage.getItem("roomDB"));
const form = document.querySelector(".lng-price-btn");
let bigTotalValue;

window.onload = function loadDatesAndTypesRooms() { // загрузка страницы
    document.querySelector('.big-date-arrival h1').innerHTML = localStorage.getItem("dateAr");
    document.querySelector('.big-date-departure h1').innerHTML = localStorage.getItem("dateDep");

    setLanguage();

    for(let key in typesRooms) { // работем сос списком выбора
        if(localStorage.getItem("room" + key) === "0") { // убираем из списка выбора типы комнат
            document.querySelector('.div-'+key).style.display = "none";
        }
        else { // показываем сколько комнат каждого типа есть и устанавливаем максимальное допустимое значение
            document.querySelector('.count-rooms' + key).innerHTML = localStorage.getItem('room' + key);
            document.querySelector('.div-' + key + ' input').max = localStorage.getItem('room' + key);
        }
    }
}

function intPrice(value, ind) { // подсчет итоговой цены
    let price = Object.values(typesRooms)[ind]["price"]*value; // цена за тип комнат
    let totalValue = 0; //подсчет всего мест
    let totalPrice = 0; //подсчет итоговой суммы

    Object.defineProperty(Object.values(typesRooms)[ind], Object.keys(Object.values(typesRooms)[ind])[1], {value : price}); // изменяем "totalPrice"
    // в typesRooms
    Object.defineProperty(Object.values(typesRooms)[ind], Object.keys(Object.values(typesRooms)[ind])[2], {value : Number(value)}); // изменяем "value"
    // в typesRooms

    document.querySelector(".div-" + Object.keys(typesRooms)[ind] + " .price-count").innerHTML = price; // выводим цену за тип комнат

    for(let allPrice in Object.values(typesRooms)) {
        totalPrice += Object.values(Object.values(typesRooms)[allPrice])[1]; //подсчет итоговой суммы
        totalValue += Object.values(Object.values(typesRooms)[allPrice])[2]*Object.values(Object.values(typesRooms)[allPrice])[3]; //подсчет всего мест
    }

    bigTotalValue = totalValue;
    document.querySelector(".total h4").innerHTML = totalPrice;
}

form.onclick = function sendForm() { // процесс брони
    let countPeople = Number(localStorage.getItem("countPeople"));

    if(countPeople > bigTotalValue) { // не хватает мест для всех, просит еще добавить комнат
        getAlert("capacity");
            return false;
    }
    else {
        let name = document.querySelector("#name").value.trim();
        let surname = document.querySelector("#last-name").value.trim();
        let phone = document.querySelector("#phone").value;
        let regTel = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/;
        if(!regTel.test(phone)) { // проверка на телефон
            getAlert("telephone");
            return false;
        }
        let email = document.querySelector("#e-mail").value.split(" ").join("");
        if(name === '' || surname === '' || email === ''){
            getAlert("emptyFields");
            return false;
        }
        let dateArLS = localStorage.getItem("dateAr");
        let dateDepLS = localStorage.getItem("dateDep");
        
        for(keys in typesRooms) {
            let countRooms = document.querySelector('.div-' + keys + ' input').value;

            if(countRooms != 0) {
                let n = 0; // сколько комнат надо забронировать
                let i = 1; // номер комнаты

                while(n < Number(countRooms)) { // занимаем то кол-во комнат, которое указал пользователь
                    let countFlag = 0;
                    let dateBook = roomDBJSON[keys][keys.substr(0, keys.length-1) + '-' + i]["datesBooking"];

                    if(dateBook.length === 0) { // если брони нет, заполняем БД
                        dateBook.push(dateArLS + "/" + dateDepLS);
                        roomDBJSON[keys][keys.substr(0, keys.length-1) + '-' + i]["fullNameBooking"].push(surname + ' ' + name);
                        roomDBJSON[keys][keys.substr(0, keys.length-1) + '-' + i]["telBooking"].push(phone);
                        roomDBJSON[keys][keys.substr(0, keys.length-1) + '-' + i]["emailBooking"].push(email);

                        n++;
                        i++;
                    }
                    else { // если есть брони, проверяем на пересечении дат 
                        for(let dates in dateBook) { // смотрим по датам и кол-ву броней
                            let arrDateForm = dateBook[dates].split("/")[0];
                            let depDateForm = dateBook[dates].split("/")[1];

                            if(arrDateForm > dateDepLS || depDateForm < dateArLS) {
                                countFlag++;
                            }

                        }

                        if(countFlag === dateBook.length) { // если пересечений нет
                            let m = 0; // индекс, куда нужно записать

                            for(let dates in dateBook) {
                                let arrDateForm = dateBook[dates].split("/")[0];

                                if(arrDateForm < dateDepLS) {
                                    m++;
                                }
                            }
                            
                            dateBook.splice(m, 0 , dateArLS + "/" + dateDepLS);
                            roomDBJSON[keys][keys.substr(0, keys.length-1) + '-' + i]["fullNameBooking"].splice(m, 0, surname + ' ' + name);
                            roomDBJSON[keys][keys.substr(0, keys.length-1) + '-' + i]["telBooking"].splice(m, 0, phone);
                            roomDBJSON[keys][keys.substr(0, keys.length-1) + '-' + i]["emailBooking"].splice(m, 0, email);

                            n++;
                        }

                        i++;
                    }
                }
            }
        }
        localStorage.setItem("roomDB", JSON.stringify(roomDBJSON)); // т.к. изменили, то сохраняем
        getAlertBooking(dateArLS, dateDepLS); // сообщение об бронировании
        window.open("index.html", target="_self");
    }
    return false;
} 