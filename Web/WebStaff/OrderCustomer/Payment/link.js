document.getElementById('Logout').addEventListener('click', function (event) {
    event.preventDefault();
    sessionStorage.clear();
    window.location.href = '/Web/Home/home.html';
});

document.getElementById('MyProfile').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/Web/Profile/profile.html';
});

document.getElementById('AddProduct').addEventListener('click', function (event) {
    window.location.href = '/Web/WebStaff/addProduct/addProduct.html';
})

document.getElementById('gomain').addEventListener('click', function (event) {
    window.location.href = '/Web/WebStaff/tablestaff/maintable.html';
})

document.getElementById('Order').addEventListener('click', function () {
    window.location.href = '/Web/WebStaff/OrderCustomer/order.html';
});
document.getElementById('Register').addEventListener('click', function () {
    window.location.href = '/Web/AuthSystem/Register_staff/register.html';
});
document.getElementById('Confirm').addEventListener('click', function () {
    window.location.href = '/Web/WebStaff/ConfirmReceipt/confirm.html';
});
document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = '/Web/WebStaff/tablestaff/maintable.html';
});