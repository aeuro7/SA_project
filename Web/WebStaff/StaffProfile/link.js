document.getElementById('Logout').addEventListener('click', function (event) {
    sessionStorage.clear();
    window.location.href = '/Web/Login_staff/login.html';
})