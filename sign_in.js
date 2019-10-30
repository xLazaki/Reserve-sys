function submit() {
    var username = document.getElementById('1').value;
    var password = document.getElementById('2').value;
    var password_comfirm = document.getElementById('3').value;
    var name = document.getElementById('4').value;
    if (password == password_comfirm) {
        axios({
            method: 'post',
            url: 'https://api.pattanachai.xyz/signup',
            data: { username: username, password: password, name: name },
        }).then((response) => {
            if (response.data.success) {
                alert('Success')
            } else {
                alert('This username has already been taken')
            }
        }).catch((err) => {
            console.log(err.toString());
        })
    } else {
        alert('password comfirm does not match')
    }
}