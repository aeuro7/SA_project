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

        fetch(`http://localhost:8080/customer/username/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Customer data:', data);

                 if (data.customer_password == password) {
                   alert("login Successful") 
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
            customer_name: name,
            customer_username: username,
            customer_phone: phone,
            customer_status: "Normal",
            customer_password: password
        };

        
    

        // ส่งคำขอแบบ POST พร้อมข้อมูล JSON
        fetch('http://localhost:8080/customer/create', {
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
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
});



