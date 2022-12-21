const arrDatePrice = document.querySelector('#arrival_date');
const depDatePrice = document.querySelector('#departure_date');
const checkBtn = document.querySelector('.lng-send');
const roomDBJSON = JSON.parse(localStorage.getItem("roomDB"));
arrDatePrice.value = localStorage.getItem("dateAr");
depDatePrice.value = localStorage.getItem("dateDep");

window.onload = function setAvailabilityAndLang() { // загрузка страницы
    let dateAr = new Date();
    arrDatePrice.min = dateAr.toISOString().split('T')[0]; // установка минимального допустимого значения в input
    depDatePrice.min = dateAr.toISOString().split('T')[0]; // установка минимального допустимого значения в input

    setLanguage();

    if(localStorage.getItem("roomDB") === null) { // есть ли БД комнат
        localStorage.setItem("roomDB", JSON.stringify(roomDB));
    }

    if(localStorage.getItem("countPeople") === null) { // есть ли "количество людей"
        localStorage.setItem("countPeople", document.querySelector("#people").value)
    }
    else {
        document.querySelector("#people").value = localStorage.getItem("countPeople");
    }
}


arrDatePrice.onchange = function changeArrDate() { // изменение даты приезда
    let dateVal = arrDatePrice.value;
    localStorage.setItem("dateAr" , dateVal.toString());

    if(dateVal > depDatePrice.value) { // дата приезда больше даты выезда => изменение даты выезда
        localStorage.setItem("dateDep" , dateVal.toString());
        depDatePrice.value = dateVal;
    }
}


depDatePrice.onchange = function changeDepDate() { // изменение даты выезда
    if(arrDatePrice.value > depDatePrice.value) { //проверка дат
        depDatePrice.value = arrDatePrice.value;
    }

    localStorage.setItem("dateDep" , depDatePrice.value.toString());
}


checkBtn.onclick = function checkRooms() { // проверяет наличие комнат на введенные даты
    let countPeople = 0;
    let arrDateLS = new Date(Date.parse(localStorage.getItem('dateAr')));
    let depDateLS = new Date(Date.parse(localStorage.getItem('dateDep')));

    document.querySelector('.lng-booking-link').style.display = "block"; // появление возмоэности брони, до этого нельзя 
    //бронировать, т.к. не сохраниться кол-во доступных комнат

    for(let typesroom in roomDBJSON) { // смотрим по типу комнат (superiors, studios и т.д.)
        let countRooms = 0; // кол-во свободных комнат на эти даты

        for(let rooms in roomDBJSON[typesroom]) { // смотрим по нумерованным комнатам (superior-1, superior-2 и т.д.)
            let arrayRoom = roomDBJSON[typesroom][rooms]["datesBooking"]; // смотрим на какие даты есть бронь
            let countFlag = 0; // флаг, что даты пользователя не пересекается с датами из БД

            if(arrayRoom.length === 0) { // если нет броней для этой комнаты
                countRooms++;
                countPeople += Number(roomDBJSON[typesroom][rooms]["countPeople"]);
            }
            else{ // если есть бронь или брони для этой комнаты
                for(let dates in arrayRoom) { // смотрим по датам и кол-ву броней
                    arrDateForm = Date.parse(arrayRoom[dates].split("/")[0]);
                    depDateForm = Date.parse(arrayRoom[dates].split("/")[1]);

                    if(arrDateForm > depDateLS || depDateForm < arrDateLS) { // проверка на пересечение
                        countFlag++;
                    }
                }

                if(countFlag === arrayRoom.length) { // если нет пересечений
                    countRooms++;
                    countPeople += Number(roomDBJSON[typesroom][rooms]["countPeople"]);
                }
            }
        }

        if(document.querySelector("#people").value > countPeople) { //если не хватает мест для всех
            getAlert(countPeople);
            return false;
        }
        else {
            localStorage.setItem("room" + typesroom, countRooms);
            localStorage.setItem("countPeople", document.querySelector('#people').value);
            
            if(countRooms === 0) { // где нет свободных комнат, убираем этот тип комнат
                document.querySelector(".room-" + typesroom).style.display = "none";
            }
            else { // где есть свободные комнаты, показываем кол-во доступных
                document.querySelector(".room-" + typesroom + " div.check-count-room").style.display = "inline-block";
                document.querySelector(".room-" + typesroom + " div.check-count-room h4").innerHTML = countRooms;
            }
        }
    }
    return false;
}