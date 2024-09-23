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
    var inputs = document.querySelectorAll('#customerInfo input');
    var isReadonly = inputs[1].hasAttribute('readonly'); // ตรวจสอบ readonly จาก input แรก

    inputs.forEach(function (input) {
        // ห้ามแก้ customerID และ customerStatus
        if (input.id !== 'customerID') {
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
    const CustomerIDString = sessionStorage.getItem('CustomerID'); // ดึงค่าจาก sessionStorage

    // หรือใช้ Number()
    const CustomerID = Number(CustomerIDString); // แปลงเป็นจำนวนเต็มเช่นกัน
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
            // ตรวจสอบ Content-Type ของการตอบสนองจากเซิร์ฟเวอร์
            const contentType = response.headers.get('Content-Type');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // หากเซิร์ฟเวอร์ส่ง JSON ให้ใช้ response.json()
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                // หากเซิร์ฟเวอร์ส่งข้อความธรรมดา ให้ใช้ response.text()
                return response.text();
            }
        })
        .then(data => {
            // แสดงข้อมูลที่ได้รับจากเซิร์ฟเวอร์
            if (typeof data === 'string') {
                alert(data); // ข้อความธรรมดา
            } else {
                alert('Update successfully!');
                console.log(data); // JSON ที่ได้รับ
                setupCustomer(data)
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Update failed!');
        });



    // ส่งคำขอแบบ POST พร้อมข้อมูล JSON

});


