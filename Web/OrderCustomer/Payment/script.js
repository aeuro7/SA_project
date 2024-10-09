document.getElementById('piclink').addEventListener('input', function() {
    var piclink = document.getElementById('piclink').value.trim();
    var imagePreview = document.getElementById('imagePreview');

    if (piclink === '') {
        // ถ้าช่องว่าง ให้แสดงรูป loading.png
        imagePreview.src = '/sorce/pic/qrcode.JPG';
    } else {
        // ลองโหลดรูปจากลิงก์ที่ใส่เข้ามา
        imagePreview.src = piclink;

        // ตรวจสอบว่ารูปโหลดสำเร็จหรือไม่
        imagePreview.onerror = function() {
            // ถ้ารูปไม่สามารถโหลดได้ ให้แสดงรูป loading.png
            imagePreview.src = '/sorce/pic/qrcode.JPG';
        };
    }
});