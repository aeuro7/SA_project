document.addEventListener('DOMContentLoaded', async function () {
    const customerID = sessionStorage.getItem('CustomerID'); // รับ CustomerID จาก sessionStorage
    console.log(customerID);

    try {
        const response = await fetch(`http://localhost:8080/orders`);
        
        // เช็คสถานะของการตอบกลับ
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); // แปลงข้อมูล JSON

        // เขียนข้อมูลในตาราง
        const orderTableBody = document.getElementById('orderTableBody');
        orderTableBody.innerHTML = ''; // ล้างข้อมูลเก่า

        data.forEach(item => {
            const order = item.order;
            const product = item.product;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.order_id}</td>
                <td>${product.product_name}</td>
                <td>${order.order_status}</td>
                <td>${order.order_total}</td>
                <td class="countdown" data-datetime="${order.order_expire}">${timeRemaining(order.order_expire)}</td>
            `;
            orderTableBody.appendChild(row);

            // เพิ่ม Event Listener สำหรับแต่ละแถว
            row.addEventListener('click', function() {
                // เก็บข้อมูลทั้งก้อนใน sessionStorage
                sessionStorage.setItem('selectedOrder', JSON.stringify(item));
                // ไปที่หน้า pay.html
                window.location.href = '/Web/WebStaff/OrderCustomer/Payment/pay.html';
            });
        });

        updateCountdown(); // อัปเดตเวลานับถอยหลัง

        // ตั้งเวลานับถอยหลังทุกๆ 1 วินาที
        setInterval(updateCountdown, 1000);
    } catch (error) {
        alert('Failed to fetch orders: ' + error.message);
    }
});


function timeRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    end.setHours(end.getHours() - 7); // ปรับเวลาสำหรับเขตเวลาในท้องถิ่น

    const timeDiff = end - now;

    if (timeDiff <= 0) {
        return 'Expired';
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} Day ${hours}:${minutes}:${seconds}s`;
}

// ฟังก์ชันเพื่ออัปเดตการนับถอยหลังสำหรับทุก element ที่มี class 'countdown'
function updateCountdown() {
    document.querySelectorAll('.countdown').forEach(cell => {
        const datetime = new Date(cell.getAttribute('data-datetime'));
        cell.textContent = timeRemaining(datetime);
    });
}
