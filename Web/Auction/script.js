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
                // Create a new row
                const row = document.createElement('tr');

                // Insert columns into the row
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><img src="${"https://m.dev-almanea.com/media/webps/jpg/media/catalog/product/i/p/iphone_16_pro_natural_titanium_hero_vertical_screen__wwen_4.webp"}" ></td>
                    <td>${product.product_name}</td>
                    <td id="description">${product.product_description}</td>
                    <td id="bid">${product.product_min} THB</td>
                    <td class="countdown" data-datetime="${product.product_bid_end_time}"></td>
                `;

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
