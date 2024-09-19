function myMenuFunction(){
    var i =document.getElementById("navMenu");

    if(i.className == "nav-menu"){
        i.className += " responsive";
    } else{
        i.className = "nav-menu";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // ดึงข้อมูลจาก sessionStorage
    const CustomerID = sessionStorage.getItem('CustomerID');
    const CustomerName = sessionStorage.getItem('CustomerName');
    const CustomerPhone = sessionStorage.getItem('CustomerPhone');
    const CustomerStatus = sessionStorage.getItem('CustomerStatus');
    const CustomerUsername = sessionStorage.getItem('CustomerUsername');
    const CustomerPassword = sessionStorage.getItem('CustomerPassword');

    // แสดงข้อมูลในช่อง input
    document.getElementById('customerID').value = CustomerID;
    document.getElementById('customerName').value = CustomerName;
    document.getElementById('customerPhone').value = CustomerPhone;
    document.getElementById('customerUsername').value = CustomerUsername;
    document.getElementById('customerPassword').value = CustomerPassword;

    // สำหรับการตรวจสอบข้อมูลใน console
    console.log("Customer Information in main.js:");
    console.log("ID:", CustomerID);
    console.log("Name:", CustomerName);
    console.log("Phone:", CustomerPhone);
    console.log("Status:", CustomerStatus);
    console.log("Username:", CustomerUsername);
    console.log("Password:", CustomerPassword);
});


// เพิ่ม event listener สำหรับปุ่ม "Edit"
document.getElementById('editButton').addEventListener('click', function() {
    var inputs = document.querySelectorAll('#customerInfo input');
    var isReadonly = inputs[1].hasAttribute('readonly'); // ตรวจสอบ readonly จาก input แรก

    inputs.forEach(function(input) {
        // ห้ามแก้ customerID และ customerStatus
        if (input.id !== 'customerID' ) {
            if (isReadonly) {
                input.removeAttribute('readonly');
            } else {
                input.setAttribute('readonly', 'readonly');
            }
        }
    });

    // เปลี่ยนข้อความปุ่มตามสถานะปัจจุบัน
    this.textContent = isReadonly ? 'Cancel' : 'Edit';
});

document.getElementById('saveButton').addEventListener('click', function() {
    // Logic to save changes
    console.log('Save button clicked');
});



document.getElementById('Logout').addEventListener('click', function (event) {
    event.preventDefault();
    sessionStorage.clear();
    window.location.href = '/Web/Login_customer/login.html';
});

document.getElementById('gomain').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/Web/MainPage/main.html';
});