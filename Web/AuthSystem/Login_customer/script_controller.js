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
        fetch('http://localhost:8080/customer/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer_username: username,
                customer_password: password
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
                if (data.customer_status != "ban") {
                    setupCustomer(data);
                    window.location.href = "/Web/MainPage/main.html";
                } else if (data.customer_status == "Ban") {
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




