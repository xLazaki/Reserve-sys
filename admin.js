function refresh(x, l) {
    axios({
        method: 'post',
        url: 'https://api.pattanachai.xyz/timeslots',
        data: { room: l, date: x },
    }).then((response) => {
        timeslots = response.data;
        console.log(response.data)
        for (var i = 0; i < 20; i++) {
            a[i] = timeslots[i].reserved;
        }
        show();
    }).catch((err) => {
        console.log(err.toString());
    })
}

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

function checktocancel(x, k) {
    var y = document.getElementById('date').value;
    if (timeslots[k].reserved == true) {
        if (confirm("confirm to cancel") == true) {
            document.getElementById(x).style.backgroundColor = "red";
            timeslots[k].reserved = false;
            axios({
                method: 'patch',
                url: 'https://api.pattanachai.xyz/free',
                headers: {
                    Authorization: getCookie(getCookie('user'))
                },
                data: [{ room: document.getElementById('Room').value, date: y, slot: k }],
            }).then((response) => {
                if (response.data.success) {
                    alert('Success')
                } else {
                    alert('Please select date')
                        //can't free
                        // response.data.fail <-- array ของการจองที่ยกเลิกไม่ได้ทั้งหมด
                }
                refresh(y,document.getElementById('Room').value);
            }).catch((err) => {
                if (err.response.status == 401) {
                    //not logged in (didn't attach token in the header)
                    alert('please login');
                }
            })
        }
    }
}

function status(x, i) {
    if (timeslots[i].reserved == true) {
        document.getElementById(x).style.backgroundColor = "red";
        document.getElementsByClassName('Reserve')[i].style.display = 'none';
        document.getElementsByClassName('cancel')[i].style.display = 'block';
        document.getElementsByClassName('user')[i].innerHTML = timeslots[i].reservervationID;
        document.getElementsByClassName('user')[i].innerHTML = timeslots[i].reserver;
    } else {
        document.getElementById(x).style.backgroundColor = "greenyellow";
        document.getElementsByClassName('cancel')[i].style.display = 'none';
        document.getElementsByClassName('Reserve')[i].style.display = 'block';
        document.getElementsByClassName('user')[i].innerHTML = "Empty";
    }
}

function show() {
    for (var i = 0; i < 20; i++) {
        status(id_status[i], i)
    }
}

function reserve_choose(i) {
    if (timeslots[i].reserved == false) {
        if (document.getElementsByClassName("Reserve")[i].innerText == 'Reserve') {
            document.getElementsByClassName("Reserve")[i].innerHTML = 'Chosen'
            document.getElementsByClassName("Reserve")[i].style.fontWeight = 'bold';
            document.getElementsByClassName('Reserve')[i].style.color = "#f90"
            document.getElementsByClassName('Reserve')[i].style.backgroundColor = "black"
            a[i] = 'chosen'
        } else {
            if (document.getElementsByClassName("Reserve")[i].innerText == 'Chosen') {
                document.getElementsByClassName("Reserve")[i].innerHTML = 'Reserve'
                document.getElementsByClassName("Reserve")[i].style.fontWeight = 'bold';
                document.getElementsByClassName('Reserve')[i].style.color = "black"
                document.getElementsByClassName('Reserve')[i].style.backgroundColor = "#f90"
                a[i] = false
            }
        }
    } else {
        alert('This time has been reserve')
    }
}

function submit() {
    var y = document.getElementById("date").value;
    if (confirm("confirm to submit") == true) {
        var datasend = [];
        for (var i = 0; i < 20; i++) {
            if (a[i] == 'chosen') {
                datasend.push({ reserver: getCookie('user'), room: document.getElementById("Room").value, date: y, slot: i.toString(10) })
                console.log(datasend)
            }
        }
        if (datasend.length == 0) {
            alert("Please select")
        } else {
            axios({
                method: 'post',
                url: 'https://api.pattanachai.xyz/reserve',
                headers: {
                    Authorization: getCookie(getCookie('user'))
                },
                data: datasend,
            }).then((response) => {
                if (response.data.success == true) {
                    alert('reserve successfully');
                    console.log(response.data)
                    refresh(y, document.getElementById("Room").value);
                } else {
                    alert("can't reserve");
                    console.log(response.data)
                    refresh(y, document.getElementById("Room").value);

                }
            }).catch((err) => {
                if (err.response.status == 401) {
                    //not logged in (didn't attach token in the header)
                    alert('please login');
                    location.replace('login.html');
                }
            })
        }
    }
}

function getdate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    b = today
    return b
}
function reload() {
    if (compareDate(document.getElementById('date').value)){
    refresh(document.getElementById('date').value,document.getElementById("Room").value);
    }else{
        alert("It was a day in the past")
        document.getElementById("date").value = getdate();
        refresh(getdate(),document.getElementById("Room").value);
    }
}
var a = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
var id_status = ["index0_can", "index1_can", "index2_can", "index3_can", "index4_can", "index5_can", "index6_can", "index7_can", "index8_can", "index9_can",
    "index10_can", "index11_can", "index12_can", "index13_can", "index14_can", "index15_can", "index16_can", "index17_can", "index18_can", "index19_can"
];
refresh(getdate(), 'Room1');
document.getElementById("date").value = getdate();
function compareDate(date1) {
    var U=getdate()
    data = []
    data.push(date1.split('-'))
    data.push(U.split('-'))
    for (var date in data) {
        date[0] == parseInt(date[0], 10)
        date[1] == parseInt(date[1], 10)
        date[2] == parseInt(date[2], 10)
    }
    if (data[0] >= data[1]) {
        return true
    } else {
        return false
    }
}
if (getCookie('user')!=''){
    var K=getCookie('user');
    document.getElementById("sign_up").style.display='none';
    document.getElementById('login').style.display='none';
    document.getElementById('onlogin1').innerHTML=K
    
}else{
    document.getElementById('onlogin1').style.display='none';
    document.getElementById('onlogin2').style.display='none';
}
function logout(){
    deleteAllCookies()
    location.replace('login.html');
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