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
    const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct'));
    const selectedPicLink = sessionStorage.getItem('selectedPicLink');
    console.log(selectedPicLink);

    if (selectedProduct) {
        // กำหนดค่าให้กับ input fields
        document.getElementById('productID').value = selectedProduct.product_id;
        document.getElementById('staffID').value = selectedProduct.staff_id;
        document.getElementById('productName').value = selectedProduct.product_name;
        document.getElementById('productDescription').value = selectedProduct.product_description;
        document.getElementById('productMin').value = selectedProduct.product_min;
        document.getElementById('productStatus').value = selectedProduct.product_status;
        document.getElementById('bidStartTime').value = selectedProduct.product_bid_start_time;
        document.getElementById('bidEndTime').value = selectedProduct.product_bid_end_time;
        document.getElementById('piclink').value = selectedPicLink;
        
        // แสดงภาพ
        if (selectedPicLink) {
            var imagePreview = document.getElementById('imagePreview');
            imagePreview.src = selectedPicLink; // ตั้งค่าภาพล่วงหน้า
            imagePreview.onerror = function() {
                // ถ้ารูปไม่สามารถโหลดได้ ให้แสดงรูป loading.png
                imagePreview.src = '/sorce/pic/loading.png';
            };
        }
    } else {
        // ถ้าไม่มี product ถูกเลือก ให้ redirect ไปยังหน้าที่ต้องการ
        window.location.href = '/Web/WebStaff/tablestaff/maintable.html';
    }
});

document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = '/Web/WebStaff/tablestaff/maintable.html';
});

document.getElementById('saveButton').addEventListener('click', function () {
    var productId = document.getElementById('productID').value;
    var staffId = document.getElementById('staffID').value;
    var productName = document.getElementById('productName').value;
    var productDescription = document.getElementById('productDescription').value;
    var productMin = document.getElementById('productMin').value;
    var productStatus = document.getElementById('productStatus').value;
    var bidStartTime = document.getElementById('bidStartTime').value;
    var bidEndTime = document.getElementById('bidEndTime').value;
    var piclink = document.getElementById('piclink').value;

    // Validate that the fields are not empty
    if (!productId || !staffId || !productName || !productDescription || !productMin || !productStatus || !bidStartTime || !bidEndTime) {
        alert('Please enter all fields');
        return;
    }

    // สร้างอ็อบเจ็กต์ JSON สำหรับ product
    var data = {
        staff_id: Number(staffId),
        product_name: productName,
        product_description: productDescription,
        product_min: Number(productMin),
        product_status: productStatus,
        product_bid_start_time: bidStartTime,
        product_bid_end_time: bidEndTime
    };

    // ส่งคำขอ PUT ไปยัง server สำหรับการอัปเดต product
    fetch(`http://localhost:8080/product/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // แปลงข้อมูลเป็น JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        updatePicture(productId,piclink);
        alert('Product updated successfully!');
        console.log(data); // แสดงข้อมูลที่ได้รับ
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Product update failed!');
    });
});

// ใช้ ID ให้ถูกต้องสำหรับ picLink
document.getElementById('piclink').addEventListener('input', function() {
    var picLink = document.getElementById('piclink').value.trim();
    var imagePreview = document.getElementById('imagePreview');

    if (picLink === '') {
        // ถ้าช่องว่าง ให้แสดงรูป loading.png
        imagePreview.src = '/sorce/pic/loading.png';
    } else {
        // ลองโหลดรูปจากลิงก์ที่ใส่เข้ามา
        imagePreview.src = picLink;

        // ตรวจสอบว่ารูปโหลดสำเร็จหรือไม่
        imagePreview.onload = function() {
            // รูปโหลดสำเร็จ
        };

        imagePreview.onerror = function() {
            // ถ้ารูปไม่สามารถโหลดได้ ให้แสดงรูป loading.png
            imagePreview.src = '/sorce/pic/loading.png';
        };
    }
});

function updatePicture(productId, picLink) {
    var picData = {
        pic_link: picLink
    };

    return fetch(`http://localhost:8080/pic/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(picData) // Convert data to JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Return the response data
    });
}

