document.getElementById('piclink').addEventListener('input', function() {
    var piclink = document.getElementById('piclink').value.trim();
    var imagePreview = document.getElementById('imagePreview');

    if (piclink === '') {
        // ถ้าช่องว่าง ให้แสดงรูป loading.png
        imagePreview.src = '/sorce/pic/qrcode.JPG';
    } else {
        // ลองโหลดรูปจากลิงก์ที่ใส่เข้ามา
        imagePreview.src = piclink;

        // ตรวจสอบว่ารูปโหลดสำเร็จหรือไม่
        imagePreview.onerror = function() {
            // ถ้ารูปไม่สามารถโหลดได้ ให้แสดงรูป loading.png
            imagePreview.src = '/sorce/pic/qrcode.JPG';
        };
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // ดึงข้อมูลจาก sessionStorage
    const selectedOrder = JSON.parse(sessionStorage.getItem('selectedOrder'));

    if (selectedOrder) {
        console.log(selectedOrder); // ตรวจสอบข้อมูลใน console

        // ใส่ข้อมูลลงในฟิลด์ต่างๆ
        document.getElementById('orderID').value = selectedOrder.order.order_id;
        document.getElementById('customerID').value = selectedOrder.order.customer_id;
        document.getElementById('productID').value = selectedOrder.product.product_id;
        document.getElementById('orderExpired').value = selectedOrder.order.order_expire;
        document.getElementById('status').value = selectedOrder.order.order_status;
        document.getElementById('amount').value = selectedOrder.order.order_total;
        document.getElementById('piclink').value = selectedOrder.order.order_slip;

        var imagePreview = document.getElementById('imagePreview');
        if (selectedOrder.order.order_slip) {
            imagePreview.src = selectedOrder.order.order_slip;
        }
        else {
            imagePreview.src = '/sorce/pic/qrcode.JPG';
        }

        // เช็คว่า order_slip มีค่าหรือไม่
        if (selectedOrder.order.order_slip) {
            // ถ้ามีค่า ให้ทำให้ piclink เป็น readonly และปิดการใช้งานปุ่ม OK
            document.getElementById('piclink').readOnly = true;
            document.querySelector('.btn').disabled = true; // Disable the button
        }

    } else {
        alert('No order data found.');
    }

    // เมื่อกดปุ่ม "OK"
    document.querySelector('.btn').addEventListener('click', async function () {
        const orderID = document.getElementById('orderID').value;
        const orderSlip = document.getElementById('piclink').value;

        // เช็คว่า orderSlip ไม่เป็น null หรือว่าง
        if (!orderSlip) {
            alert('Please provide an order slip.');
            return; // ถ้า orderSlip เป็น null หรือว่าง ให้หยุดการทำงาน
        }

        // สร้างคำขอแบบ PUT เพื่ออัปเดตข้อมูลสลิป
        const requestData = {
            order_id: parseInt(orderID),
            order_slip: orderSlip
        };

        try {
            const response = await fetch('http://localhost:8080/order/update/slip', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            // เช็คสถานะการตอบกลับ
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
            alert('Order slip updated successfully');
            document.getElementById('piclink').readOnly = true; // ทำให้ช่อง piclink เป็น readonly
            button = document.querySelector('.btn');
            button.disabled = true; // ปิดการใช้งานปุ่ม

        } catch (error) {
            alert('Failed to update order slip: ' + error.message);
        }
    });
});
