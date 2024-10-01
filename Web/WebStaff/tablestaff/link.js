document.getElementById('Logout').addEventListener('click', function (event) {
    sessionStorage.clear();
    window.location.href = '/Web/Home/home.html';
})
document.getElementById('MyProfile').addEventListener('click', function (event) {
    window.location.href = '/Web/WebStaff/StaffProfile/profile.html';   
})

document.getElementById('AddProduct').addEventListener('click', function (event) {
    window.location.href = '/Web/WebStaff/addProduct/addProduct.html';
})
document.getElementById('gomain').addEventListener('click', function (event) {
    window.location.href = '/Web/WebStaff/tablestaff/maintable.html';
})