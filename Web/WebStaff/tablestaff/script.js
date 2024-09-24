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

                // Set default row structure without image yet
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><img src="" id="img-${product.product_id}"></td>
                    <td>${product.product_name}</td>
                    <td id="description">${product.product_description}</td>
                    <td id="bid">${product.product_min} THB</td>
                    <td id="bid">${product.product_status}</td>
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
    const now = new Date();
    const timeDiff = endDate - now;

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