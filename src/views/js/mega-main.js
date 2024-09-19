/* Menu responsive */
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.close-btn');

hamburgerMenu.addEventListener('click', () => {
    mobileMenu.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('show');
});

/* popup */
const locationButton = document.querySelector('.location span');
const locationPopup = document.getElementById('location-popup');
const closePopup = document.querySelector('.close-popup');
const confirmLocationBtn = document.getElementById('confirm-location');
const locationSelect = document.getElementById('location-select');

// abrir popup al hacer clic en el lugar
locationButton.addEventListener('click', () => {
    locationPopup.style.display = 'flex';
});

// cerar popup con x
closePopup.addEventListener('click', () => {
    locationPopup.style.display = 'none';
});

// confirmar la ubicación seleccionada
confirmLocationBtn.addEventListener('click', () => {
    const selectedLocation = locationSelect.options[locationSelect.selectedIndex].text;
    
    locationButton.textContent = `📍 ${selectedLocation}`;
    locationPopup.style.display = 'none'; // Cerrar el popup
});
