document.getElementById('piclink').addEventListener('input', function() {
    var piclink = document.getElementById('piclink').value.trim();
    var imagePreview = document.getElementById('imagePreview');

    if (piclink === '') {
        // If empty, show loading.png
        imagePreview.src = '/sorce/pic/qrcode.JPG';
    } else {
        // Attempt to load image from the input link
        imagePreview.src = piclink;

        // Check if the image loads successfully
        imagePreview.onerror = function() {
            // If image fails to load, show loading.png
            imagePreview.src = '/sorce/pic/qrcode.JPG';
        };
    }
});

// Function to set order info from sessionStorage
function setOrderInfo(selectedOrder) {
    console.log(selectedOrder); // Check data in console

    // Populate fields with data
    document.getElementById('orderID').value = selectedOrder.order.order_id;
    document.getElementById('customerID').value = selectedOrder.order.customer_id;
    document.getElementById('productID').value = selectedOrder.product.product_id;
    document.getElementById('orderExpired').value = selectedOrder.order.order_expire;
    document.getElementById('status').value = selectedOrder.order.order_status;
    document.getElementById('amount').value = selectedOrder.order.order_total;

    var imagePreview = document.getElementById('imagePreview');
    if (selectedOrder.order.order_slip) {
        imagePreview.src = selectedOrder.order.order_slip; // Display existing slip image
        document.getElementById('piclink').value = selectedOrder.order.order_slip; // Set piclink to match slip
        document.getElementById('piclink').readOnly = true; // Make piclink read-only
    } else {
        imagePreview.src = '/sorce/pic/qrcode.JPG'; // Use default image if no slip
    }
}

// Function to ban user
async function banUser() {
    const customerID = document.getElementById('customerID').value;
    console.log(customerID);

    try {
        const response = await fetch(`http://localhost:8080/customer/ban/${customerID}`, {
            method: 'PUT', // Use PUT method
            headers: {
                'Content-Type': 'application/json' // Set Content-Type to application/json
            }
            // No body needed for banning user
        });

        // Check response status
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json(); // Check result
        console.log(result);
        alert('User banned successfully');
    } catch (error) {
        alert('Failed to ban user: ' + error.message);
    }
}

// Function to confirm slip
async function confirmSlip() {
    const orderSlip = document.getElementById('piclink').value.trim();
    if (!orderSlip) {
        alert('Please provide an order slip.');
        return; // ถ้า orderSlip เป็น null หรือว่าง ให้หยุดการทำงาน
    }
    const orderID = parseInt(document.getElementById('orderID').value, 10); // แปลงเป็น number
    const customerID = parseInt(document.getElementById('customerID').value, 10); // แปลงเป็น number
    const productID = parseInt(document.getElementById('productID').value, 10); // แปลงเป็น number
    console.log(`Order ID: ${orderID}`); // แสดง orderID
    console.log(`Customer ID: ${customerID}`); // แสดง customerID
    console.log(`Product ID: ${productID}`); // แสดง productID

    try {
        // อัปเดตสถานะคำสั่งซื้อ
        const responseUpdate = await fetch('http://localhost:8080/order/update/status', {
            method: 'PUT', // ใช้ PUT method
            headers: {
                'Content-Type': 'application/json' // ตั้งค่า Content-Type เป็น application/json
            },
            body: JSON.stringify({
                order_id: orderID // ส่ง order_id เป็น JSON
            })
        });

        // ตรวจสอบสถานะการตอบกลับ
        if (!responseUpdate.ok) {
            const errorData = await responseUpdate.json(); // รับข้อมูลข้อผิดพลาด
            throw new Error(`Failed to update order status: ${errorData.message}`);
        }

        // สร้างใบเสร็จ
        const responseCreate = await fetch('http://localhost:8080/receipt/create', {
            method: 'POST', // ใช้ POST method
            headers: {
                'Content-Type': 'application/json' // ตั้งค่า Content-Type เป็น application/json
            },
            body: JSON.stringify({
                order_id: orderID, // ส่ง order_id เป็น JSON
                customer_id: customerID, // ส่ง customer_id เป็น JSON
                product_id: productID // ส่ง product_id เป็น JSON
            })
        });

        // ตรวจสอบสถานะการตอบกลับสำหรับการสร้างใบเสร็จ
        if (!responseCreate.ok) {
            const errorData = await responseCreate.json(); // รับข้อมูลข้อผิดพลาด
            throw new Error(`Failed to create receipt: ${errorData.message}`);
        }

        const result = await responseCreate.json(); // รับผลลัพธ์จากเซิร์ฟเวอร์
        console.log(result);
        alert(result.message); // แสดงข้อความที่ส่งกลับจากเซิร์ฟเวอร์
    } catch (error) {
        alert('Error: ' + error.message); // แสดงข้อผิดพลาด
        console.error('Error details:', error); // บันทึกรายละเอียดข้อผิดพลาด
    }
}

// Event listener for confirm button






// Function called when DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve data from sessionStorage
    const selectedOrder = JSON.parse(sessionStorage.getItem('selectedOrder'));

    if (selectedOrder) {
        setOrderInfo(selectedOrder); // Call function to set field values
    } else {
        alert('No order data found.');
    }

    
});

document.getElementById('confirm').addEventListener('click', confirmSlip);
document.getElementById('ban').addEventListener('click', banUser);
