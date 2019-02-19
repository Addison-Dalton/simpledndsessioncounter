$(document).ready( () => {

    var url = 'https://api.myjson.com/bins/jpoqi';
    var dateDiff = 0;
    var selectedDate;
    var selectedDateJSON;
    const password = 'dalton';

    $datePicker = $('#datepicker');
    $setDatePasswordForm = $('#setDatePasswordForm');
    $passwordInput = $('#passwordInput');
    $passwordIncorrect = $('#passwordIncorrect');
    $dayNumberElem = $('#die-number');

    $setDatePasswordForm.on('submit', function(e) {
        e.preventDefault();
        checkPassword($passwordInput.val());
    });

    $('#closeSetDateModal').on('click', function() {
        $datePicker.addClass('hidden');
    });

    

    var datePicker = new Pikaday({ 
        field: document.getElementById('datepicker'),
        defaultDate: new Date(selectedDateJSON),
        setDefaultDate: true,
        onSelect: function() {
            updateSelectedDate();
            setNumberOfDays();

            // Updates the die number
            setDate();
        }
    });

    $.get(url, function(data, textStatus, jqXHR) {
        selectedDateJSON = data.date;
        selectedDate = new Date(selectedDateJSON);
        setNumberOfDays();
        setDate();
    });

    function checkPassword(enteredPassword) {
        $passwordIncorrect.addClass('hidden');
        if (enteredPassword === password) {
            $datePicker.toggleClass('hidden');
            $setDatePasswordForm.toggleClass('hidden');
        } else {
            $passwordIncorrect.removeClass('hidden');
        }
    }

    function setNumberOfDays() {
        var oneDay = 24*60*60*1000;
        var today = new Date();
        // if the current date is the same as the selected D&D date, set the dateDiff to 0
        if (today.getDate() === selectedDate.getDate() && today.getMonth() === selectedDate.getMonth() && today.getFullYear() === selectedDate.getFullYear()) {
            dateDiff = 0;
        } else {
            dateDiff = Math.round(Math.abs((today.getTime() - selectedDate.getTime()) / (oneDay)) + 1);
        }
    }

    function setDate() {
        $($dayNumberElem).text(dateDiff);
    }

    function updateSelectedDate() {
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