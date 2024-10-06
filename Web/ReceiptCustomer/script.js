document.addEventListener('DOMContentLoaded', function () {
    let myrow = 1;
    
});





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
