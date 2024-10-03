// ฟังก์ชันสำหรับเปิด/ปิดเมนู
function myMenuFunction() {
    var i = document.getElementById("navMenu");
    if (i.className == "nav-menu") {
        i.className += " responsive";
    } else {
        i.className = "nav-menu";
    }
}

document.addEventListener('DOMContentLoaded', async function () {

    
    // ดึงข้อมูลจาก sessionStorage
    const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct'));
    const selectedPicLink = selectedProduct.product_picture   
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
        document.getElementById('piclink').value = selectedProduct.product_picture;
        document.getElementById('imagePreview').src = selectedProduct.product_picture;
        
        

        // Fetch highest bid and set it
        const highestBid = await getHighestBid(selectedProduct.product_id);
        document.getElementById('highest').value = highestBid || 'No bid';

        // แสดงภาพ
        var imagePreview = document.getElementById('imagePreview');
        if (selectedPicLink) {
            console.log("Selected picture link:", selectedPicLink); // ตรวจสอบค่าที่ได้
            imagePreview.src = selectedPicLink; // ตั้งค่าภาพล่วงหน้า
        } else {
            imagePreview.src = '/sorce/pic/loading.png'; // Fixed path
        }

        imagePreview.onerror = function() {
            console.error('ไม่สามารถโหลดรูปภาพได้:', imagePreview.src); // แสดง URL ที่มีปัญหา
            imagePreview.src = '/sorce/pic/loading.png'; // Fixed path
        };

    } else {
        // ถ้าไม่มี product ถูกเลือก ให้ redirect ไปยังหน้าที่ต้องการ
        window.location.href = '/Web/WebStaff/tablestaff/maintable.html';
    }
});

// ฟังก์ชันที่ใช้ในการอัปเดตรูปภาพ
document.getElementById('piclink').addEventListener('input', function() {
    var picLink = document.getElementById('piclink').value.trim();
    var imagePreview = document.getElementById('imagePreview');

    if (picLink === '') {
        // ถ้าช่องว่าง ให้แสดงรูป loading.png
        imagePreview.src = '/sorce/pic/loading.png'; // แก้ไขเส้นทางที่ถูกต้อง
    } else {
        // ลองโหลดรูปจากลิงก์ที่ใส่เข้ามา
        imagePreview.src = picLink;

        // ตรวจสอบว่ารูปโหลดสำเร็จหรือไม่
        imagePreview.onload = function() {
            console.log('รูปโหลดสำเร็จ:', picLink); // แสดงข้อความเมื่อโหลดสำเร็จ
        };

        imagePreview.onerror = function() {
            console.error('ไม่สามารถโหลดรูปภาพได้จากลิงก์:', picLink); // แสดง URL ที่มีปัญหา
            imagePreview.src = '/sorce/pic/loading.png'; // Fixed path
        };
    }
});


// ฟังก์ชันเพื่อดึงราคาประมูลสูงสุด
async function getHighestBid(product_id) {
    try {
        const response = await fetch(`http://localhost:8080/bid/highest/${product_id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.bid_price || null; // คืนค่าราคาประมูลสูงสุดหากมี หรือ null หากไม่มี
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null; // คืนค่า null ในกรณีมีข้อผิดพลาด
    }
}

// ฟังก์ชันตรวจสอบรูปแบบวันที่และเวลา: YYYY-MM-DD HH:MM:SS
// ฟังก์ชันตรวจสอบรูปแบบวันที่และเวลา ทั้งแบบ YYYY-MM-DDTHH:MM:SSZ และ YYYY-MM-DD HH:MM:SS
function isValidDate(dateString) {
    const regex1 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/; // ISO 8601
    const regex2 = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;   // แบบมีช่องว่าง
    return regex1.test(dateString) || regex2.test(dateString);
}



async function updateProduct() {
    // ดึงค่าจาก input fields
    const productID = parseInt(document.getElementById('productID').value); // แปลงเป็น int
    const staffID = parseInt(document.getElementById('staffID').value); // email
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productMin = parseFloat(document.getElementById('productMin').value); // แปลงเป็น float สำหรับตัวเลขที่อาจมีทศนิยม
    const productStatus = document.getElementById('productStatus').value;
    const bidStartTime = document.getElementById('bidStartTime').value;
    const bidEndTime = document.getElementById('bidEndTime').value;
    const productPicture = document.getElementById('piclink').value;

    // ตรวจสอบว่า productMin ต้องมากกว่า 0
    if (productMin <= 0) {
        alert('Product minimum price must be greater than 0.');
        return;
    }

    // ตรวจสอบรูปแบบของวันที่และเวลา
    if (!isValidDate(bidStartTime) || !isValidDate(bidEndTime)) {
        alert('Invalid date format. Please use YYYY-MM-DD HH:MM:SS.');
        return;
    }

    // สร้างอ็อบเจ็กต์ที่เก็บข้อมูลสำหรับการส่งไปยัง backend
    const updatedProduct = {
        staff_id: staffID,
        product_name: productName,
        product_description: productDescription,
        product_min: productMin,
        product_status: productStatus,
        product_bid_start_time: bidStartTime,
        product_bid_end_time: bidEndTime,
        product_picture: productPicture
    };

    try {
        // ทำการส่ง PUT request ไปยัง API เพื่ออัปเดต product
        const response = await fetch(`http://localhost:8080/product/update/${productID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct) // แปลงข้อมูลเป็น JSON string
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Product updated successfully:', result);

        // แสดงข้อความแจ้งเตือนว่าการอัปเดตเสร็จสิ้น
        alert('Product updated successfully!');
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product');
    }
}

// ผูกฟังก์ชันกับปุ่มเมื่อคลิก
document.getElementById('saveButton').addEventListener('click', updateProduct);
