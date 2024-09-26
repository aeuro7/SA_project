document.getElementById('Logout').addEventListener('click', function (event) {
    sessionStorage.clear();
    window.location.href = '/Web/Login_staff/login.html';
})
document.getElementById('MyProfile').addEventListener('click', function (event) {
    window.location.href = '/Web/WebStaff/StaffProfile/profile.html';   
})