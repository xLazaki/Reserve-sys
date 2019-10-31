function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue;
}   

function checklog() {
    var username = document.getElementsByClassName("input_username")[0].value;
    var password = document.getElementsByClassName("input_password")[0].value;
    axios({
        method: 'post',
        url: 'https://api.pattanachai.xyz/login',
        data: { username: username, password: password },
    }).then((response) => {
        if (response.data.success == true) {
            if (username == 'admin@mail.com') {
                location.replace('admin.html');
                setCookie(username, response.data.token, 1);
                setCookie('user', username, 1);
            } else {
                location.replace('user_timeslot.html');
                setCookie(username, response.data.token, 1);
                setCookie('user', username, 1);
            }
        } else {
            alert("Wrong username or password");
        }
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