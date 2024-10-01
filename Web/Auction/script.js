document.addEventListener('DOMContentLoaded', function () {
    let myrow = 1;
    
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
            var currentTime = new Date();
            currentTime.setHours(currentTime.getHours() + 7); // Adjust to current timezone
            var bidStartTime = new Date(product.product_bid_start_time);
            
            if (bidStartTime > currentTime) {
                return; // Skip if it's before the bid start time
            }

            var bidEndtime = new Date(product.product_bid_end_time);
            if (currentTime > bidEndtime) {
                return; // Skip if the bid has ended
            }

            // Create a new row
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${myrow++}</td>
                <td><img src="${product.product_picture}" id="img-${product.product_id}" alt="Product Image"></td>
                <td>${product.product_name}</td>
                <td id="description">${product.product_description}</td>
                <td id="bid-${product.product_id}">Loading...</td>
                <td class="countdown" data-datetime="${product.product_bid_end_time}"></td>
            `;

            // Fetch and display the highest bid for the product
            getHighestBid(product.product_id).then(bid => {
                const bidElement = document.getElementById(`bid-${product.product_id}`);
                if (bid) {
                    bidElement.textContent = `${bid} THB`;
                } else {
                    bidElement.textContent = 'No bid';
                }

                // Add click event listener to the row
                row.addEventListener('click', () => {
                    // Prepare data to send on click
                    const productData = {
                        ...product,
                        highest_bid: bid || 'No bid'
                    };

                    // Save product data with image and bid to session storage
                    sessionStorage.setItem('selectedProduct', JSON.stringify(productData));    
                    
                    // Redirect to the details page
                    window.location.href = '/Web/Auction/Bid/product.html';
                });
            });

            // Append the row to the table body
            tbody.appendChild(row);
        });

        updateCountdown(); // Initial update
        setInterval(updateCountdown, 1000); // Update every second
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});


// Function to get the highest bid by product ID (returning a Promise)
function getHighestBid(product_id) {
    console.log(product_id);
    return fetch(`http://localhost:8080/bid/highest/${product_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.bid_price || null; // Return the highest bid if available, or null if no bid
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            return null; // Return null on error
        });
}

// Function to calculate and display time remaining
function timeRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    end.setHours(end.getHours() - 7); // Adjust for local timezone

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

// Function to update the countdown for all elements with the 'countdown' class
function updateCountdown() {
    document.querySelectorAll('.countdown').forEach(cell => {
        const datetime = new Date(cell.getAttribute('data-datetime'));
        cell.textContent = timeRemaining(datetime);
    });
}
