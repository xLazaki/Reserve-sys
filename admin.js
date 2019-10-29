function refresh() {
    axios({
        method: 'post',
        url: 'https://api.pattanachai.xyz/timeslots',
        data: { room: 'testRoom', date: 'testDate' },
    }).then((response) => {
        timeslots = response.data;
        for (var i = 0; i < 20; i++) {
            a[i] = timeslots[i].reserved;
        }
        show();
    }).catch((err) => {
        console.log(err.toString());EAD
    })  
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
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
    if (timeslots[k].reserved == true) {
        if (confirm("confirm to cancel") == true) {
            document.getElementById(x).style.backgroundColor = "red";
            timeslots[k].reserved = false;
            axios({
                method: 'patch',
                url: 'https://api.pattanachai.xyz/free',
                headers: {authorization:getCookie(getCookie('user'))
                },
                data: [{ room: 'testRoom', date: 'testDate', slot: k }],
            }).then((response) => {
                if (response.data.success==true) {
                url: 'https://api.pattanachai.xyz:/free',
                headers: {
                    authorization: getCookie(getCookie('user'))
                },
                data: [{ room: 'testRoom', date: 'testDate', slot: k }],
            }).then((response) => {
                if (response.data.success == true) {
                    console.log(response.data.reservationDetails);
                    refresh();
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
            a[i] = 'chosen'
        } else {
            if (document.getElementsByClassName("Reserve")[i].innerText == 'Chosen') {
                document.getElementsByClassName("Reserve")[i].innerHTML = 'Reserve'
                a[i] = false
            }
        }
    } else {
        alert('This time has been reserve')
    }
}
function submit() {
        var datasend=[];
        for (var i = 0; i < 20; i++) {
            if(a[i] == 'chosen'){
                datasend.push({reserver:getCookie('user'),room: "testRoom",date: "testDate",slot: i.toString(10)})
            }
        }
        if (datasend.length==0){
            alert("Please select")
        }else{
            axios({
                method: 'post', 
                url: 'https://api.pattanachai.xyz/reserve',
                headers: {
                    Authorization: getCookie(getCookie('user'))
                },
                data: datasend,
                }).then((response)=>{
                    if(response.data.success==true){
                        alert('reserve successfully');
                        refresh();
                    }
                    else{
                        alert("can't reserve");
                    
                    }
                }).catch((err)=>{
                    if(err.response.status==401){
                        //not logged in (didn't attach token in the header)
                        alert('please login');
                        location.replace('login.html');
                    }
                })
        }
    }
var a = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
var id_status = ["index0_can", "index1_can", "index2_can", "index3_can", "index4_can", "index5_can", "index6_can", "index7_can", "index8_can", "index9_can",
    "index10_can", "index11_can", "index12_can", "index13_can", "index14_can", "index15_can", "index16_can", "index17_can", "index18_can", "index19_can"
];
refresh();