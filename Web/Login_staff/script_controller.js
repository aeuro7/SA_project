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

        console.log(username)
        console.log(password)
        

        fetch(`http://localhost:8080/staff/username/${username}`)
            .then(response => {
                if (!response.ok) {
                    alert("Username Wrong")
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })

            

            .then(data => {

                if (data.staff_password == password && data.staff_status != "Ban") {
                    setupStaff(data) 
                    window.location.href = "/Web/MainPage/main.html";
                }
                else if (data.staff_status == "Ban"){
                    alert("You are Ban!!!")
                }
                else {
                    alert("wrong password")
                }
                // Handle the response data here
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    });
});


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Register_button').addEventListener('click', function () {
        // รับค่า ID จาก input
        var name = document.getElementById('re1').value;
        var username = document.getElementById('re2').value;
        var phone = document.getElementById('re3').value;
        var password = document.getElementById('re4').value;

        // Validate that the fields are not empty
        if (!username || !password || !name || !phone) {
            alert('Please enter all fields');
            return;
        }

        // สร้างอ็อบเจ็กต์ JSON
        var data = {
            staff_name: name,
            staff_username: username,
            staff_phone: phone,
            staff_status: "Normal",
            staff_password: password
        };

        fetch(`http://localhost:8080/staff/username/${username}`)
            .then(response => {
                if (!response.ok) {
                    fetch('http://localhost:8080/staff/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data) // แปลงข้อมูลเป็น JSON
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
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
                            login()
                            console.log(data);
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });

                }
                else {
                    alert("This username is already in use");
                    document.getElementById('re2').value = '';

                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });



        // ส่งคำขอแบบ POST พร้อมข้อมูล JSON

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




