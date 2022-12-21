let delBtn = document.querySelector('.lng-delete-btn');
let cheBtn = document.querySelector('.lng-check-btn');
const arrDate = document.querySelector('#arrival_date');
const depDate = document.querySelector('#departure_date');

let dateAr = new Date();
arrDate.min = dateAr.toISOString().split('T')[0]; // установка минимального допустимого значения в input
depDate.min = dateAr.toISOString().split('T')[0];

let roomDB1 = JSON.parse(localStorage.getItem("roomDB"));

function getForm(action) { // получаем все данные и БД комнат
    let name = document.querySelector("#name").value.trim();
    let surname = document.querySelector("#last-name").value.trim();
    let arrDate = document.querySelector("#arrival_date").value;
    let depDate = document.querySelector("#departure_date").value;
    let fullFIO = surname + ' ' + name;
    let dates = arrDate + "/" + depDate;
    if(name === '' || surname === '' || arrDate === '' || depDate === '') {
        getAlert("emptyFields");
        return false;
    }

    const arrAnsDel = [];
    var arrAnsCh = '';

    var i = -1; // для выявления, есть ли такой клиент
    for(let typesRooms in roomDB1) {
        var countRoom = 0;
        for(let room in roomDB1[typesRooms]) {
            for(let date in roomDB1[typesRooms][room]["datesBooking"]) {
                if(roomDB1[typesRooms][room]["datesBooking"][date] === dates) {
                    i = date;
                    let shortAnswer = roomDB1[typesRooms][room];

                    if(shortAnswer["fullNameBooking"][i] === fullFIO) { //если правильно введены фамилия, имя
                        arrAnsDel.push([i, typesRooms, room]);
                        countRoom++;
                    }
                }
            }
        }
        if(countRoom !== 0) {
            arrAnsCh += typesRooms + " : " + countRoom + "\n";
        }
    }


    if(action === "delete"){ 
        return arrAnsDel;
    }
    else {
        return [arrAnsCh, i];
    }
}

delBtn.onclick = function() { // процесс отмены брони
    let form = getForm("delete");
    if(form === false) {
        return false;
    }

    var m = -1;
    for(let n in form) {
        roomDB1[form[n][1]][form[n][2]]["datesBooking"].splice(form[n][0], 1);
        roomDB1[form[n][1]][form[n][2]]["fullNameBooking"].splice(form[n][0], 1);
        roomDB1[form[n][1]][form[n][2]]["telBooking"].splice(form[n][0], 1);
        roomDB1[form[n][1]][form[n][2]]["emailBooking"].splice(form[n][0], 1);
        m = form[n][0];
    }

    if(m === -1) { // если неправильно введено или нет броней
        getAlert("notCorData");
        return false;
    }
    else { // бронь отменена
        getAlert("noneBooking");
        window.open("price.html", target="_self");
    }
    
    localStorage.setItem("roomDB", JSON.stringify(roomDB1)); // изменить БД
    return false;
}

cheBtn.onclick = function() {
    let form = getForm("check");
    if(form === false) {
        return false;
    }

    if(form[1] === -1) { // если неправильно введено или нет броней
        getAlert("notCorData");
    }
    else { // проверка записи завершена
        getAlertCheckBooking(form[0]);
    }

    return false;
}