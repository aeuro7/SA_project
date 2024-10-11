document.addEventListener('DOMContentLoaded', () => {
    // ดึงข้อมูลใบเสร็จที่เก็บไว้ใน sessionStorage
    const selectedReceipt = JSON.parse(sessionStorage.getItem('selectedReceipt'));

    if (selectedReceipt) {
        // แสดงข้อมูลใบเสร็จในส่วนที่กำหนด
        document.querySelector('.receipt-details p').textContent = `Receipt ID : #${selectedReceipt.receipt_id}`;
        document.querySelector('.receipt-details h1').textContent = `Order by : ${selectedReceipt.customer.customer_name} (Staff)`;
        document.querySelector('.receipt-details h3:nth-of-type(1)').innerHTML = `Name : ${selectedReceipt.customer.customer_name} <p>( ID : ${selectedReceipt.customer.customer_id} )</p>`;
        document.querySelector('.receipt-details h3:nth-of-type(2)').innerHTML = `Product : ${selectedReceipt.product.product_name} <p>( ID : ${selectedReceipt.product.product_id} )</p>`;
        document.querySelector('.receipt-details h3:nth-of-type(3)').textContent = `Price : ${selectedReceipt.order.order_total} THB`;
        document.querySelector('.receipt-details h3:nth-of-type(4)').textContent = `Status : ${selectedReceipt.receipt_status}`;
    } else {
        // หากไม่มีข้อมูลใน sessionStorage แสดงข้อความเตือน
        alert('No receipt data found.');
    }

    // ฟังก์ชันสำหรับปุ่ม Back
    document.querySelector('.back').addEventListener('click', () => {
        window.history.back(); // ย้อนกลับไปหน้าก่อนหน้า
    });
});
