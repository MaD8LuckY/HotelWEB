function getAlert(typeAl) { // получить алерт
    let lang = localStorage.getItem('sel');
    alert(langArr[typeAl + '-alert'][lang]);
}

function getAlertBooking(value1, value2) { // получить алерт на бронь
    const bookingAlt = {
        "ru" : `Вы забронировали номер на ${value1} по ${value2}`,
        "en" : `You have booked a room on ${value1} by ${value2}`
    };

    let lang = localStorage.getItem('sel');
    
    alert(bookingAlt[lang]);
}

function getAlertCheckBooking(ans) {
    let lang = localStorage.getItem('sel');
    alert(langArr["checkbooking-alert"][lang] + ans);
}