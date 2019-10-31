var reserve_data = [];
var today = new Date();
var todayD = today.getDate();
var todayM = today.getMonth();
var todayY = today.getFullYear();
var dateString = todayY + "-" + (todayM + 1) + "-" + todayD;
document.getElementById('DateId').setAttribute('value', dateString)

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function sign_out(){
    deleteAllCookies();
    location.replace("login.html");
}

function findTarget(index, round) {
    n = document.getElementsByClassName('status');
    target = n[round].children[index];
    return target
}

function reserveRoom(i, round){
    reserve_data.push([i, round]);
    n = document.getElementsByClassName('status')[round].children[i];
    n.innerHTML = "<td><button onclick='cancelRoom(".concat(i, ",", round, ")' type=\"button\" class='btn btn-primary'>Chosen</button></td>");
}

function findIndex(arr, target) {
    for (var i=0 ; i<arr.length ; i++) {
        if (arr[i][0] == target[0] && arr[i][1] == target[1]) {
            return i;
        }
    }
}

function cancelRoom(i, round) {
    var delete_target = findIndex(reserve_data, [i, round]);
    reserve_data.splice(delete_target, 1);
    n = document.getElementsByClassName('status')[round].children[i];
    n.innerHTML = "<td><button onclick='reserveRoom(".concat(i, ",", round, ")' type=\"button\" class='btn btn-secondary'>Empty</button></td>");
}

function full() {
    alert('Sorry, this room is unavailable.');
}

function booked() {
    alert('You already booked at this time.');
}

function generateObject(data) {
    result = []
    var dateFromDefault = document.getElementById('DateId').value
    var roomFromDefault = document.getElementById('room_dropdown').value
    if (dateFromDefault == "") {
        dateFromDefault = "testDate"
    }
    for (var item of data) {
        result.push({room: roomFromDefault, date: dateFromDefault, slot:(item[0]-1+(item[1]*10))})
    }
    return result
}

function submit() {
    if (reserve_data.length == 0) {
        alert("Please select the time first.");
    }
    else {
        var c = confirm("Please confirm your booking.");
        if (c == true) {
            axios({
                method: 'post', 
                url: 'https://api.pattanachai.xyz/reserve',
                headers: {
                    Authorization: getCookie(getCookie('user'))
                },
                data: generateObject(reserve_data),
            }).then((response)=>{
                console.log(response.data)
                if(response.data.success){
                    //reserve successfully
                    alert('Reserved!');
                    for (var i=0 ; i<reserve_data.length ; i++){
                        var index = reserve_data[i];
                        n = document.getElementsByClassName('status')[index[1]].children[index[0]];
                        n.innerHTML = "<td><button onclick='booked()' type=\"button\" class='btn btn-warning'>Booked</button></td>";
                    }
                    reserve_data = []
                }
                else{
                    //can't reserve
                    alert("Can't reserve");
                    // response.data.fail <-- array ของห้องทั้งหมดที่จองไม่ได้
                }
            }).catch((err)=>{
                if(err.response.status==401){
                    //not logged in (didn't attach token in the header)
                    alert('please login');
                }
            })
        }
    }
}

function getRoomAndDate() {
    data = []
    var dateFromDefault = document.getElementById('DateId').value
    var roomFromDefault = document.getElementById('room_dropdown').value
    if (dateFromDefault == "") {
        dateFromDefault = "testDate"
    }
    data.push({
        room: roomFromDefault,
        date: dateFromDefault
    })
    return data[0]
}

function createRoomDrop() {
    axios({
        method: 'get', 
        url: 'https://api.pattanachai.xyz/rooms',
        headers: {
            Authorization: getCookie(getCookie('user'))
        },
        data: {name: 'testDate'},
        }).then((response)=>{
            var room_dropdown = document.getElementById('room_dropdown')
            for (var item of response.data){
                var node = document.createElement('option')
                var text = document.createTextNode(item['name'])
                node.appendChild(text)
                room_dropdown.appendChild(node) 
            }
            getHead()
        })
}

function getHead() {
    var roomChosen = document.getElementById('room_dropdown').value
    document.getElementById('roomHead').innerHTML = roomChosen
}

function refresh() {
    getHead()
    axios({
        method:  'post',
        url:  'https://api.pattanachai.xyz/timeslots',
        data: getRoomAndDate(),
    }).then((response)=>{
        timeslot = response.data
        // console.log(response.data)
        for(var i=1 ; i<21 ; i++){
            var round = Math.floor(i/11)
            if (i >= 11) {
                var index = (i+1)%11
            } else {
                var index = i%11
            }
            if (timeslot[i-1].reserved == true) { //full
                target = findTarget(index, round);
                target.innerHTML = "<td><button onclick='full()' type=\"button\" class='btn btn-danger'>Busy</button></td>";
            }
            else { //available
                target = findTarget(index, round);
                target.innerHTML = "<td><button onclick='reserveRoom(".concat(index, ",", round, ")' type=\"button\" class='btn btn-secondary'>Empty</button></td>");
            }
        }
    }).catch((err)=>{
        console.log(err.toString());
    })
}

//----------------------------------
var cook = getCookie('user');
document.getElementById('ABC').innerHTML=cook
createRoomDrop()
refresh()