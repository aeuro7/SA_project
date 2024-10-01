document.addEventListener('DOMContentLoaded', async function () {
    // Get the selected product from sessionStorage
    const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct'));
    const CustomerID = sessionStorage.getItem('CustomerID');

    if (!selectedProduct) {
        // If no product is selected, redirect back to the auction page
        window.location.href = '/Web/Auction/auction.html';
        return; // Ensure to exit the function
    }

    const productNameElement = document.getElementById('productName');
    const productIdElement = document.getElementById('productId');
    const productDescriptionElement = document.getElementById('productDescription');
    const startTimeElement = document.getElementById('startTime');
    const endTimeElement = document.getElementById('endTime');
    const startBidElement = document.getElementById('startBid');
    const highestBidElement = document.getElementById('highestBid');
    const imagePreviewElement = document.getElementById('imagePreview');
    const bidInputElement = document.querySelector('input[name="Bid"]');
    const bidButton = document.getElementById('bidButton');

    // Update the product details with the selected product's information
    productNameElement.textContent = selectedProduct.product_name;
    productIdElement.textContent = `Product ID: ${selectedProduct.product_id}`;
    productDescriptionElement.textContent = selectedProduct.product_description;
    startTimeElement.textContent = `Time Start: ${selectedProduct.product_bid_start_time}`;
    endTimeElement.textContent = `Time End: ${selectedProduct.product_bid_end_time}`;
    startBidElement.textContent = `Start bid: ${selectedProduct.product_min} THB`;

    // Update the product image
    if (selectedProduct.product_picture) {
        imagePreviewElement.src = selectedProduct.product_picture;
    } else {
        imagePreviewElement.src = '/source/pic/loading.png'; // Default image
    }

    // Fetch the highest bid for the product and update the highestBidElement
    const highestBid = await getHighestBid(selectedProduct.product_id);
    if (highestBid !== null) {
        highestBidElement.textContent = `Highest Bid: ${highestBid + ' THB'}`;
    } else {
        highestBidElement.textContent = 'Highest Bid: No bid yet'; // Display "No bid yet" if no bid
    }

    // Add event listener for the Bid button
    bidButton.addEventListener('click', async function () {
        const bidPrice = parseFloat(bidInputElement.value);
        const minBid = parseFloat(selectedProduct.product_min);
        const highestBidValue = highestBid !== null ? parseFloat(highestBid) : 0; // Use the fetched highest bid value

        // Check if the bid is lower than the minimum or highest bid
        if (isNaN(bidPrice)) {
            alert('Please enter a valid number for the bid.');
            return;
        }

        if (bidPrice < minBid) {
            alert(`Your bid is lower than the starting bid of ${minBid} THB.`);
            return;
        }

        if (bidPrice <= highestBidValue) {
            alert(`Your bid is not higher than the highest bid of ${highestBidValue} THB.`);
            return;
        }

        // Prepare the POST request body
        const requestBody = {
            customer_id: parseInt(CustomerID, 10), // Convert to integer
            product_id: parseInt(selectedProduct.product_id, 10), // Convert to integer
            price: parseInt(bidPrice, 10) // Convert to integer
        };

        try {
            const response = await fetch('http://localhost:8080/bid/attempt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            // Check if the response is successful
            if (response.status === 201) {
                alert('Bid placed successfully!'); // Handle success
            } else {
                const errorBody = await response.json(); // Handle potential error responses
                alert(`Error: ${errorBody.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while placing your bid.');
        }
    });
});

// Function to get the highest bid for a product
async function getHighestBid(product_id) {
    try {
        const response = await fetch(`http://localhost:8080/bid/highest/${product_id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.bid_price || null; // Return the highest bid if available, or null if no bid
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null; // Return null on error
    }
}
