document.addEventListener('DOMContentLoaded', function () {
    fetch(`http://localhost:8080/products/active`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            const tbody = document.querySelector('tbody');
            data.forEach((product, index) => {
                // ตรวจสอบว่าถึงเวลาเริ่มประมูลหรือยัง
                var currentTime = new Date();
                currentTime.setHours(currentTime.getHours() + 7); // เพิ่ม 7 ชั่วโมงให้กับเวลาปัจจุบัน
                var bidStartTime = new Date(product.product_bid_start_time);
                
                if (bidStartTime > currentTime) {
                    // ถ้ายังไม่ถึงเวลาเริ่มประมูล ให้ข้ามไปยัง product ถัดไป
                    return;
                }

                var bidEndtime = new Date(product.product_bid_end_time);

                if (currentTime > bidEndtime) {
                    // ถ้าเวลาปัจจุบันเกินเวลาสิ้นสุดประมูล ให้ข้ามไปยัง product ถัดไป
                    return;
                }

                // Create a new row
                const row = document.createElement('tr');

                // Set default row structure without image yet
                row.innerHTML = `
                    <td>${index}</td>
                    <td><img src="" id="img-${product.product_id}"></td>
                    <td>${product.product_name}</td>
                    <td id="description">${product.product_description}</td>
                    <td id="bid">${product.product_min} THB</td>
                    <td class="countdown" data-datetime="${product.product_bid_end_time}"></td>
                `;

                // Add click event listener to the row
                row.addEventListener('click', () => {
                    // Save selected product to session storage
                    sessionStorage.setItem('selectedProduct', JSON.stringify(product));    
                    // Redirect to the details page (adjust the URL accordingly)
                    window.location.href = '/Web/Auction/test.html';
                });

                // Append the row to the table body
                tbody.appendChild(row);

                // Fetch and update the image for the product
                getPic(product.product_id).then(picLink => {
                    const imgElement = document.getElementById(`img-${product.product_id}`);
                    if (picLink) {
                        imgElement.src = picLink;
                    } 
                    else {
                        imgElement.src = null;
                    }
                });
            });

            updateCountdown(); // Initial update
            setInterval(updateCountdown, 1000); // Update every second
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

// Function to calculate and display time remaining
function timeRemaining(endDate) {
    const now = new Date(); // เวลาปัจจุบันในเขตเวลาของผู้ใช้
    const end = new Date(endDate); // แปลงเวลาจาก UTC ที่รับมา

    // เพิ่มเวลา 7 ชั่วโมงสำหรับเวลาประเทศไทย
    end.setHours(end.getHours() - 7); 

    const timeDiff = end - now; // คำนวณความต่างของเวลา

    if (timeDiff <= 0) {
        return 'Expired';
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Function to update the countdown for all elements with the 'countdown' class
function updateCountdown() {
    document.querySelectorAll('.countdown').forEach(cell => {
        const datetime = new Date(cell.getAttribute('data-datetime'));
        cell.textContent = timeRemaining(datetime);
    });
}

// Function to get picture link by product ID (returning a Promise)
function getPic(product_id) {
    return fetch(`http://localhost:8080/pic/product/${product_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                return ""; // Return empty string if there's an error
            } else {
                return data.pic_link; // Return the picture link
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            return ""; // Return empty string on error
        });
}
