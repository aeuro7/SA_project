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
