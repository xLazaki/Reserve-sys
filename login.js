function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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