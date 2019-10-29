var reserve_data = []

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
    for (var item of data) {
        result.push({room: 'testRoom', date:'testDate', slot:(item[0]-1+(item[1]*10))})
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
                }
                else{
                    //cant reserve
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

axios({
    method:  'post',
    url:  'https://api.pattanachai.xyz/timeslots',
    data: {room:  'testRoom', date:'testDate'},
}).then((response)=>{
    timeslot = response.data
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