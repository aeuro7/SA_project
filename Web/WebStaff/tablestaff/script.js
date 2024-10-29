document.addEventListener('DOMContentLoaded', function () {
    fetch(`http://localhost:8080/products`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector('tbody');
            data.forEach((product, index) => {
                // Create a new row
                const row = document.createElement('tr');

                // Set row structure with image from the JSON response, check if image is valid
                const productPicture = product.product_picture || '/sorce/pic/loading.png'; // Use default if no image

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><img src="${productPicture}" id="img-${product.product_id}" alt="${product.product_name}" onerror="this.src='/source/pic/loading.png';"></td>
                    <td>${product.product_name}</td>
                    <td id="description">${product.product_min}</td>
                    <td id="bid-${product.product_id}">Loading...</td>
                    <td>${product.product_status}</td>
                    <td class="countdown" data-datetime="${product.product_bid_end_time}"></td>
                `;

                // Add click event listener to the row
                row.addEventListener('click', () => {
                    // Save selected product to session storage
                    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
                    
                    // Redirect to the details page (adjust the URL accordingly)
                    window.location.href = `/Web/WebStaff/editProduct/main.html`;
                });

                // Append the row to the table body
                tbody.appendChild(row);

                // Fetch highest bid
                getHighestBid(product.product_id).then(bid => {
                    const bidElement = document.getElementById(`bid-${product.product_id}`);
                    bidElement.textContent = bid ? `${bid} THB` : 'No bid';
                });
            });

            updateCountdown(); // Initial update
            setInterval(updateCountdown, 1000); // Update every second
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

// Function to get the highest bid
function getHighestBid(product_id) {
    return fetch(`http://localhost:8080/bid/highest/${product_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.bid_price || null) // Return the highest bid if available, or null if no bid
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            return null; // Return null on error
        });
}

// Function to calculate and display time remaining
function timeRemaining(endDate) {
    const now = new Date(); // Current time in user's timezone
    const end = new Date(endDate); // Convert UTC time received

    // Adjust for Thailand timezone (UTC+7)
    end.setHours(end.getHours() - 7);

    const timeDiff = end - now; // Calculate time difference

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
        const datetime = cell.getAttribute('data-datetime');
        cell.textContent = timeRemaining(datetime);
    });
}


document.addEventListener('DOMContentLoaded', function () {
    // ดึงข้อมูลจาก sessionStorage
    const StaffID = sessionStorage.getItem('StaffID');
    const StaffName = sessionStorage.getItem('StaffName');
    const StaffPhone = sessionStorage.getItem('StaffPhone');
    const StaffStatus = sessionStorage.getItem('StaffStatus');
    const StaffUsername = sessionStorage.getItem('StaffUsername');
    const StaffPassword = sessionStorage.getItem('StaffPassword');


    // สำหรับการตรวจสอบข้อมูลใน console
    console.log("Staff Information in main.js:");
    console.log("ID:", StaffID);
    console.log("Name:", StaffName);
    console.log("Phone:", StaffPhone);
    console.log("Status:", StaffStatus);
    console.log("Username:", StaffUsername);
    console.log("Password:", StaffPassword);
});