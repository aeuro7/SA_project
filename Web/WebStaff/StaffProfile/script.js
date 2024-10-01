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
    const StaffID = sessionStorage.getItem('StaffID');
    const StaffName = sessionStorage.getItem('StaffName');
    const StaffPhone = sessionStorage.getItem('StaffPhone');
    const StaffStatus = sessionStorage.getItem('StaffStatus');
    const StaffUsername = sessionStorage.getItem('StaffUsername');
    const StaffPassword = sessionStorage.getItem('StaffPassword');

    // แสดงข้อมูลในช่อง input
    document.getElementById('StaffID').value = StaffID;
    document.getElementById('StaffName').value = StaffName;
    document.getElementById('StaffPhone').value = StaffPhone;
    document.getElementById('StaffUsername').value = StaffUsername;
    document.getElementById('StaffPassword').value = StaffPassword;

    // สำหรับการตรวจสอบข้อมูลใน console
    console.log("Staff Information in main.js:");
    console.log("ID:", StaffID);
    console.log("Name:", StaffName);
    console.log("Phone:", StaffPhone);
    console.log("Status:", StaffStatus);
    console.log("Username:", StaffUsername);
    console.log("Password:", StaffPassword);
});


document.getElementById('editButton').addEventListener('click', function () {
    var nameInput = document.getElementById('StaffName');
    var passwordInput = document.getElementById('StaffPassword');
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
    var name = document.getElementById('StaffName').value;
    var username = document.getElementById('StaffUsername').value;
    var phone = document.getElementById('StaffPhone').value;
    var password = document.getElementById('StaffPassword').value;

    // Validate that the fields are not empty
    if (!username || !password || !name || !phone) {
        alert('Please enter all fields');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    const StaffIDString = sessionStorage.getItem('StaffID'); // ดึงค่าจาก sessionStorage
    const StaffID = Number(StaffIDString); // แปลงเป็นจำนวนเต็มเช่นกัน
    const StaffStatus = sessionStorage.getItem('StaffStatus');

    // สร้างอ็อบเจ็กต์ JSON
    var data = {
        staff_id: StaffID,
        staff_name: name,
        staff_username: username,
        staff_phone: phone,
        staff_status: StaffStatus,
        staff_password: password
    };


    fetch(`http://localhost:8080/staff/update/${StaffID}`, {
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
                setupStaff(data)
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Update failed!');
        });




});


