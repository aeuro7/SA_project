function myMenuFunction(){
    var i =document.getElementById("navMenu");

    if(i.className == "nav-menu"){
        i.className += " responsive";
    } else{
        i.className = "nav-menu";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // อ่านข้อมูลจาก sessionStorage
    const CustomerID = sessionStorage.getItem('CustomerID');
    const CustomerName = sessionStorage.getItem('CustomerName');
    const CustomerPhone = sessionStorage.getItem('CustomerPhone');
    const CustomerStatus = sessionStorage.getItem('CustomerStatus');
    const CustomerUsername = sessionStorage.getItem('CustomerUsername');
    const CustomerPassword = sessionStorage.getItem('CustomerPassword');

    console.log("Customer Information in main.js:");
    console.log("ID:", CustomerID);
    console.log("Name:", CustomerName);
    console.log("Phone:", CustomerPhone);
    console.log("Status:", CustomerStatus);
    console.log("Username:", CustomerUsername);
    console.log("Password:", CustomerPassword);


});

document.getElementById('Logout').addEventListener('click', function (event) {
    event.preventDefault();
    sessionStorage.clear();
    window.location.href = '/Web/Login_customer/login.html';
});

document.getElementById('MyProfile').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/Web/Profile/profile.html';
});