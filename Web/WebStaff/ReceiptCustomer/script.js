document.addEventListener('DOMContentLoaded', async () => {
    const customerId = sessionStorage.getItem('CustomerID'); // ดึง customer_id จาก sessionStorage

    // สร้าง URL สำหรับคำขอ GET โดยแทนที่ {customerId} ด้วยค่า customerId ที่ได้
    const url = `http://localhost:8080/receipts/all`;
    
    // ทำคำขอ GET ไปยัง API
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('receiptsTableBody');
        tableBody.innerHTML = ''; // ล้างข้อมูลเก่าก่อน

        // วนลูปเพื่อสร้างแถวในตารางสำหรับข้อมูลแต่ละ receipt
        data.forEach(receipt => {
            const tr = document.createElement('tr');

            // เพิ่ม event listener ให้กับแถวเพื่อย้ายไปยังหน้าใหม่
            tr.addEventListener('click', () => {
                // ส่งข้อมูล receipt ทั้งก้อนไปยัง sessionStorage
                sessionStorage.setItem('selectedReceipt', JSON.stringify(receipt));

                // ย้ายไปยังหน้าต่อไป (เปลี่ยน URL ตามที่คุณต้องการ)
                window.location.href = '/Web/ReceiptCustomer/Receipt/receiptD.html'; // เปลี่ยนเป็นหน้าที่คุณต้องการ
            });

            tr.innerHTML = `
                <td>${receipt.receipt_id}</td>
                <td>${receipt.order_id}</td>
                <td>${receipt.product_id}</td>
                <td>${receipt.receipt_status}</td>
                <td>${receipt.order.order_total}</td>
            `;
            tableBody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
