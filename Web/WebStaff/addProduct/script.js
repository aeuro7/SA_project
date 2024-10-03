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
    var productName = document.getElementById('productName').value.trim();
    var productDescription = document.getElementById('productDescription').value.trim();
    var productMin = document.getElementById('productMin').value.trim();
    var productStatus = document.getElementById('productStatus').value;
    var bidStartTime = document.getElementById('bidStartTime').value.trim();
    var bidEndTime = document.getElementById('bidEndTime').value.trim();
    var piclink = document.getElementById('piclink').value.trim();

    // ตรวจสอบค่าของ productMin
    if (isNaN(productMin) || parseInt(productMin) <= 0) {
        alert("Product Min must be a number greater than 0.");
        return;
    }

    // ตรวจสอบว่าชื่อผลิตภัณฑ์และคำอธิบายเป็น string
    if (typeof productName !== 'string' || typeof productDescription !== 'string') {
        alert("Product Name and Product Description must be strings.");
        return;
    }

    // ตรวจสอบรูปแบบวันที่
    if (!isValidDate(bidStartTime) || !isValidDate(bidEndTime)) {
        alert("Please enter valid date formats for Bid Start Time and Bid End Time (YYYY-MM-DD HH-MM-SS).");
        return;
    }

    // สร้าง JSON payload เพื่อส่งไปยัง backend
    var productData = {
        staff_id: parseInt(staffID),
        product_name: productName,
        product_description: productDescription,
        product_min: parseInt(productMin), // แปลงเป็นจำนวนเต็ม
        product_status: productStatus,
        product_bid_start_time: bidStartTime,
        product_bid_end_time: bidEndTime,
        product_picture: piclink // เพิ่มลิงก์ภาพเข้าไปใน JSON
    };

    // ตรวจสอบว่าข้อมูลในฟอร์มถูกต้องหรือไม่
    if (!productName || !productDescription || !productMin || !bidStartTime || !bidEndTime) {
        alert("Please enter all fields");
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
            alert('Product created successfully!');
            // สามารถทำการ redirect หรือเคลียร์ฟอร์มหลังจากสร้างสินค้าเสร็จแล้ว
            document.getElementById('productName').value = '';
            document.getElementById('productDescription').value = '';
            document.getElementById('productMin').value = '';
            document.getElementById('productStatus').value = '';
            document.getElementById('bidStartTime').value = '';
            document.getElementById('bidEndTime').value = '';
            document.getElementById('piclink').value = '';
            document.getElementById('imagePreview').src = '/source/pic/loading.png'; // reset image preview
        } else {
            alert('Error creating product.');
        }
    })
    .catch((error) => {
        console.error(error);
        alert('Error creating product.');
    });
});

// ฟังก์ชันเพื่อตรวจสอบรูปแบบวันที่
// ฟังก์ชันเพื่อตรวจสอบรูปแบบวันที่
function isValidDate(dateString) {
    // รูปแบบที่ใช้สำหรับการตรวจสอบ: YYYY-MM-DD HH:MM:SS
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(dateString);
}

