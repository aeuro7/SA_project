
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Register_button').addEventListener('click', function () {
        // รับค่า ID จาก input
        var name = document.getElementById('re1').value;
        var username = document.getElementById('re2').value;
        var phone = document.getElementById('re3').value;
        var password = document.getElementById('re4').value;

        // Validate that the fields are not empty
        if (!name || !username || !phone || !password) {
            alert('Please enter all fields');
            return;
        }

        // ตรวจสอบว่า password มีอย่างน้อย 8 ตัว
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        // ตรวจสอบว่า phone เป็นเลข 10 หลัก
        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            alert('Phone number must be exactly 10 digits long');
            return;
        }

        if (!username.trim()) {
            alert('Please enter a username.');
            return;
        }
        
        if (username.includes(' ')) {
            alert('Username cannot contain spaces.');
            return;
        }
        


        // สร้างอ็อบเจ็กต์ JSON
        var data = {
            customer_name: name,
            customer_username: username,
            customer_phone: phone,
            customer_status: "Normal",
            customer_password: password
        };

        fetch('http://localhost:8080/customer/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // แปลงข้อมูลเป็น JSON
        })
        .then(response => {
            if (!response.ok) {
                // อ่านข้อมูลข้อผิดพลาดจาก body
                return response.json().then(errData => {
                    throw new Error(errData.error || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(data => {
            // แสดงข้อมูลที่ได้รับจากเซิร์ฟเวอร์
            alert('Customer created successfully!');
            document.getElementById('re1').value = '';
            document.getElementById('re2').value = '';
            document.getElementById('re3').value = '';
            document.getElementById('re4').value = '';
            console.log(data);
            window.location.href = '/Web/AuthSystem/Login_customer/login.html';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Error: ' + error.message); // แสดงข้อความ error
        });
    });
});

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