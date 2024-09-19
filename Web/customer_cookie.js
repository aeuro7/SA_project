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

