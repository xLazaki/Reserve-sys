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
if (getCookie('user')!=''){
    var K=getCookie('user');
    document.getElementById('sign_up').style='display:none;'
    document.getElementById('login').style.display='none';
    document.getElementById('onlogin1').innerHTML=K;
}else{
    document.getElementById('onlogin1').style.display='none';
    document.getElementById('onlogin2').style.display='none';
}