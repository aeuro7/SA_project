document.addEventListener("DOMContentLoaded", function () {
    const okButton = document.querySelector(".confirm-input button");
    const receiptIdInput = document.querySelector(".confirm-input input");

    okButton.addEventListener("click", async function () {
        const receiptId = receiptIdInput.value;

        console.log(receiptId);

        if (!receiptId) {
            alert("Please enter a receipt ID.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/receipts/finish/${receiptId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // หากต้องการทำอะไรเพิ่มเติมหลังจากการอัปเดตสำเร็จ
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while updating the receipt status.");
        }
    });
});
