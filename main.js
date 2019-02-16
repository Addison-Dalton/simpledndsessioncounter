$(document).ready( () => {

    var url = 'https://api.myjson.com/bins/jpoqi';
    var $dayNumberElem = $('#die-number');
    var numberOfDays = 0;
    var selectedDate = getSelectedDate();
    console.log('data' + selectedDate);
    var dateDiff = 0;

    getNumberOfDays();
    setDate();

    var datePicker = new Pikaday({ 
        field: document.getElementById('datepicker'),
        onSelect: function() {
            updateSelectedDate();
            numberOfDays = getNumberOfDays();

            // Updates the die number
            setDate();
        }
    });

    function getNumberOfDays() {
        var oneDay = 24*60*60*1000;
        var today = new Date();

        // if the current date is the same as the selected D&D date, set the dateDiff to 0
        if (today.getDate() === selectedDate.getDate() && today.getMonth() === selectedDate.getMonth() && today.getFullYear() === selectedDate.getFullYear()) {
            dateDiff = 0;
        } else {
            dateDiff = Math.round(Math.abs((today.getTime() - selectedDate.getTime()) / (oneDay)) + 1);
        }

        return dateDiff;
    }

    function setDate() {
        $($dayNumberElem).text(dateDiff);
    }

    function getSelectedDate() {
        $.get(url, function(data, textStatus, jqXHR) {
            console.log(data);
            console.log(data.date);
            return data.date;
        });
    }

    function updateSelectedDate(date) {
        selectedDate = datePicker.getDate();
        var dataurl = '{"date":' + '"' + selectedDate.toJSON() + '"' + '}';
        $.ajax({
            url: url,
            type: "PUT",
            data: dataurl,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data, textStatus, jqXHR){
                console.log('date succssfully updated to: ' + selectedDate.toJSON());
            }
        });
    }
});