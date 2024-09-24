function setupCustomer(data) {
    // เก็บข้อมูลใน localStorage
    sessionStorage.setItem('CustomerData', data);
    sessionStorage.setItem('CustomerID', data.customer_id);
    sessionStorage.setItem('CustomerName', data.customer_name);
    sessionStorage.setItem('CustomerPhone', data.customer_phone);
    sessionStorage.setItem('CustomerStatus', data.customer_status);
    sessionStorage.setItem('CustomerUsername', data.customer_username);
    sessionStorage.setItem('CustomerPassword', data.customer_password);

}

function setupStaff(data) {
    // เก็บข้อมูลใน localStorage
    sessionStorage.setItem('StaffData', data);
    sessionStorage.setItem('StaffID', data.staff_id);
    sessionStorage.setItem('StaffName', data.staff_name);
    sessionStorage.setItem('StaffPhone', data.staff_phone);
    sessionStorage.setItem('StaffStatus', data.staff_status);
    sessionStorage.setItem('StaffUsername', data.staff_username);
    sessionStorage.setItem('StaffPassword', data.staff_password);

}

