
document.addEventListener('DOMContentLoaded', function () {
    // ดึงข้อมูลจาก sessionStorage
    const StaffID = sessionStorage.getItem('StaffID');
    const StaffName = sessionStorage.getItem('StaffName');
    const StaffPhone = sessionStorage.getItem('StaffPhone');
    const StaffStatus = sessionStorage.getItem('StaffStatus');
    const StaffUsername = sessionStorage.getItem('StaffUsername');
    const StaffPassword = sessionStorage.getItem('StaffPassword');

    document.getElementById('staffID').value = StaffID;

    // สำหรับการตรวจสอบข้อมูลใน console
    console.log("Staff Information in main.js:");
    console.log("ID:", StaffID);
    console.log("Name:", StaffName);
    console.log("Phone:", StaffPhone);
    console.log("Status:", StaffStatus);
    console.log("Username:", StaffUsername);
    console.log("Password:", StaffPassword);


});

document.getElementById('piclink').addEventListener('input', function() {
    var piclink = document.getElementById('piclink').value.trim();
    var imagePreview = document.getElementById('imagePreview');

    if (piclink === '') {
        // ถ้าช่องว่าง ให้แสดงรูป loading.png
        imagePreview.src = '/sorce/pic/loading.png';
    } else {
        // ลองโหลดรูปจากลิงก์ที่ใส่เข้ามา
        imagePreview.src = piclink;

        // ตรวจสอบว่ารูปโหลดสำเร็จหรือไม่
        imagePreview.onerror = function() {
            // ถ้ารูปไม่สามารถโหลดได้ ให้แสดงรูป loading.png
            imagePreview.src = '/sorce/pic/loading.png';
        };
    }
});


document.getElementById('saveButton').addEventListener('click', function() {
    // รับค่าจากฟอร์ม
    var staffID = document.getElementById('staffID').value;
    var productName = document.getElementById('productName').value;
    var productDescription = document.getElementById('productDescription').value;
    var productMin = document.getElementById('productMin').value;
    var productStatus = document.getElementById('productStatus').value;
    var bidStartTime = document.getElementById('bidStartTime').value;
    var bidEndTime = document.getElementById('bidEndTime').value;
    var piclink = document.getElementById('piclink').value;

    // สร้าง JSON payload เพื่อส่งไปยัง backend
    var productData = {
        staff_id: parseInt(staffID),
        product_name: productName,
        product_description: productDescription,
        product_min: parseInt(productMin), // แปลงเป็นจำนวนเต็ม
        product_status: productStatus,
        product_bid_start_time: bidStartTime,
        product_bid_end_time: bidEndTime
    };

    // ตรวจสอบว่าข้อมูลในฟอร์มถูกต้องหรือไม่
    if (!productName || !productDescription || !productMin || !bidStartTime || !bidEndTime) {
        alert("plase enter all fields");
        return;
    }

    console.log(productData);

    // ส่งคำขอ POST ไปยัง backend
    fetch('http://localhost:8080/product/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    .then(response => response.json())
    .then(data => {
        // ตรวจสอบผลลัพธ์การตอบกลับ
        if (data) {
            createPic(data.product_id, piclink);
            alert('Product created successfully!');
            
            // สามารถทำการ redirect หรือเคลียร์ฟอร์มหลังจากสร้างสินค้าเสร็จแล้ว
        } else {
            alert('Error creating product.');
        }
    })
    .catch((error) => {
        console.error(error);
        alert('Error creating product.');
    });
});

function createPic(productID, piclink) {
    // สร้าง JSON payload เพื่อส่งไปยัง backend
    var picData = {
        product_id: parseInt(productID), // แปลงเป็นจำนวนเต็ม
        pic_link: piclink
    };

    // ตรวจสอบว่าข้อมูลในฟอร์มถูกต้องหรือไม่
    if (!productID || !piclink) {
        alert("invalid input");
        return;
    }

    // ส่งคำขอ POST ไปยัง backend
    fetch('http://localhost:8080/pic/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(picData),
    })
    .then(response => response.json())
    .then(data => {
        // ตรวจสอบผลลัพธ์การตอบกลับ
        if (data) {
            alert('Picture created successfully!');
            // เคลียร์ฟอร์มหลังจากสร้างรูปเสร็จ
        } else {
            alert('Error creating picture.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error creating picture.');
    });
}



