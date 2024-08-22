
function simulateLoginStatus(isLoggedIn) {
    return new Promise((resolve) => {
        // Simulamos una respuesta de API con el valor proporcionado
        resolve({ loggedIn: isLoggedIn });
    });
}