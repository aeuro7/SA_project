function myMenuFunction() {
    var i = document.getElementById("navMenu");

    if (i.className == "nav-menu") {
        i.className += " responsive";
    } else {
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
document.getElementById('editButton').addEventListener('click', function () {
    var nameInput = document.getElementById('customerName');
    var passwordInput = document.getElementById('customerPassword');
    var isReadonly = nameInput.hasAttribute('readonly'); // ตรวจสอบ readonly จาก input username

    // สลับ readonly สำหรับ Username และ Password
    if (isReadonly) {
        nameInput.removeAttribute('readonly');
        passwordInput.removeAttribute('readonly');
        this.textContent = 'Cancel'; // เปลี่ยนข้อความปุ่มเป็น "Cancel"
    } else {
        nameInput.setAttribute('readonly', 'readonly');
        passwordInput.setAttribute('readonly', 'readonly');
        this.textContent = 'Edit'; // เปลี่ยนข้อความปุ่มกลับเป็น "Edit"
    }
});


document.getElementById('saveButton').addEventListener('click', function () {
    var name = document.getElementById('customerName').value;
    var username = document.getElementById('customerUsername').value;
    var phone = document.getElementById('customerPhone').value;
    var password = document.getElementById('customerPassword').value;

    // Validate that the fields are not empty
    if (!username || !password || !name || !phone) {
        alert('Please enter all fields');
        return;
    }

    // Check if password is at least 8 characters long
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    const CustomerIDString = sessionStorage.getItem('CustomerID'); // ดึงค่าจาก sessionStorage
    const CustomerID = Number(CustomerIDString); // แปลงเป็นจำนวนเต็ม
    const CustomerStatus = sessionStorage.getItem('CustomerStatus');

    // สร้างอ็อบเจ็กต์ JSON
    var data = {
        customer_id: CustomerID,
        customer_name: name,
        customer_username: username,
        customer_phone: phone,
        customer_status: CustomerStatus,
        customer_password: password
    };

    fetch(`http://localhost:8080/customer/update/${CustomerID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // แปลงข้อมูลเป็น JSON
    })
        .then(response => {
            const contentType = response.headers.get('Content-Type');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then(data => {
            if (typeof data === 'string') {
                alert(data); // ข้อความธรรมดา
            } else {
                alert('Update successfully!');
                console.log(data); // JSON ที่ได้รับ
                setupCustomer(data);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Update failed!');
        });
});
