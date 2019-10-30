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
                data: [{ room: document.getElementById('Room'), date: y, slot: k }],
            }).then((response) => {
                if (response.data.success) {
                    alert('Success')
                } else {
                    alert('Please select date')
                        //can't free
                        // response.data.fail <-- array ของการจองที่ยกเลิกไม่ได้ทั้งหมด
                }
                refresh(y);
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
                datasend.push({ reserver: getCookie('user'), room: document.getElementById("Room"), date: y, slot: i.toString(10) })
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
                    refresh(y, document.getElementById("Room"));
                } else {
                    alert("can't reserve");

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
    a = today
    return a
}

function reload() {
    refresh(document.getElementById('date').value,document.getElementById("room").value);
}
var a = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
var id_status = ["index0_can", "index1_can", "index2_can", "index3_can", "index4_can", "index5_can", "index6_can", "index7_can", "index8_can", "index9_can",
    "index10_can", "index11_can", "index12_can", "index13_can", "index14_can", "index15_can", "index16_can", "index17_can", "index18_can", "index19_can"
];
refresh(getdate(), 'Room1');
document.getElementById("date").value = getdate();