document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Login_button').addEventListener('click', function () {
        // รับค่า ID จาก input
        var username = document.getElementById('in1').value;
        var password = document.getElementById('in2').value;

        // Validate that the fields are not empty
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        console.log(username);
        console.log(password);

        // ส่ง POST request ไปที่ /login
        fetch('http://localhost:8080/staff/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                staff_username: username,
                staff_password: password
            })
        })
            .then(response => {
                if (!response.ok) {
                    alert("Invalid username or password");
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.staff_status != "Ban") {
                    setupStaff(data);
                    window.location.href = "/Web/WebStaff/tablestaff/maintable.html";
                } else if (data.staff_status == "Ban") {
                    alert("You are banned!");
                } else {
                    alert("Wrong password");
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
});



document.addEventListener('DOMContentLoaded', function () {
    // อ่านข้อมูลจาก sessionStorage
    const StaffID = sessionStorage.getItem('StaffID');
    const StaffName = sessionStorage.getItem('StaffName');
    const StaffPhone = sessionStorage.getItem('StaffPhone');
    const StaffStatus = sessionStorage.getItem('StaffStatus');
    const StaffUsername = sessionStorage.getItem('StaffUsername');
    const StaffPassword = sessionStorage.getItem('StaffPassword');

    console.log("Staff Information in main.js:");
    console.log("ID:", StaffID);
    console.log("Name:", StaffName);
    console.log("Phone:", StaffPhone);
    console.log("Status:", StaffStatus);
    console.log("Username:", StaffUsername);
    console.log("Password:", StaffPassword);


});




