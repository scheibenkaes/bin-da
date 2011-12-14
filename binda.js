var binda = {
    data: $.jStorage.get("binda", {}) || {},

    save: function () {
        $.jStorage.set("binda", this.data);
    },

    today: function () {
        return this.data[today_as_string()];
    }
};

(function() {
    if (!$.jStorage.storageAvailable()) { 
        alert("Leider nicht Tim. Diese Wahnsinns-App braucht einen html5 fähigen Browser!");
        return;
    }

    var today = today_as_string();

    if (binda.data[today] == undefined) {
        binda.data = insert_today(binda.data);
        binda.save();
    }
})();

function onTodayPageLoad () {
    setup_buttons();
}

function setup_buttons() {
    var comeBtn = $("#comeBtn");
    var goBtn = $("#goBtn");
    var today = today_as_string();
    var data = binda.data[today];
    if (data.come == null) { 
        comeBtn.button('enable');
    } else {
        comeBtn.button('disable');
        goBtn.button('enable');
    }
    if (data.come != null && data.go == null) {
        goBtn.button('enable');
        comeBtn.button('disable');
    } 

    if (data.come != null && data.go != null) {
        comeBtn.button('disable');
        goBtn.button('disable');
        $("#done").show();
    }
    comeBtn.button('refresh');
    goBtn.button('refresh');
}

function onComeBtn () {
    var today = today_as_string();
    binda.data[today].come = new Date();
    binda.save();
    setup_buttons();
}

function onGoBtn () {
    var today = today_as_string();
    binda.data[today].go = new Date();
    binda.save();
    setup_buttons();
}

function today_as_string () {
    var today = new Date();
    return today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();
}

function insert_today(data) {
    data[today_as_string()] = { come: null, go : null };
    return data;
}

function format_time (time) {
    if (time == null)
        return "--:--";
    var t = new Date(time);
    var h = t.getHours();
    var m = t.getMinutes();
    return t.toTimeString().split(" ", 1); //h + ":" + m;
}

function render_data (data) {
    console.log(data);
    var lis = [];
    for(var p in data) {
        var comeAndGo = data[p];
        var div = "<li data-role='list-divider'>" + p + "</li>";
        var come = "<li>Kommen <p class='ui-li-aside'>" + format_time(comeAndGo.come) + "</p></li>";
        var go = "<li>Gehen <p class='ui-li-aside'>" + format_time(comeAndGo.go) + "</p></li>";
        lis.push(div + come + go);
    }
    return lis.reverse();
}

function onGridShown() {
    var lis = render_data(binda.data);
    var ul = $('#grid');
    ul.empty();
    for(var li in lis) {
        ul.append(lis[li]);
    }
    ul.listview('refresh');
}


