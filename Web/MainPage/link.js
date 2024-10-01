document.getElementById('Logout').addEventListener('click', function (event) {
    event.preventDefault();
    sessionStorage.clear();
    window.location.href = '/Web/Home/home.html';
});

document.getElementById('MyProfile').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/Web/Profile/profile.html';
});
document.getElementById('Auction').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/Web/Auction/auction.html';
});

document.getElementById('Notification').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/Web/Profile/profile.html';
});

document.getElementById('gomain').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/Web/MainPage/main.html';
});