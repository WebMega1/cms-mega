function cargaLeftSidebar() {
    fetch('/left-sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('left-sidebar').innerHTML = data;
            
        })
        .catch(error => console.error('Error loading left-sidebar:', error));
}

function cargaNavBar() {
    fetch('/navBar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('navBar').innerHTML = data;
            
        })
        .catch(error => console.error('Error loading left-sidebar:', error));
}

function cargaNavBar() {
    fetch('/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footer').innerHTML = data;
            
        })
        .catch(error => console.error('Error loading left-sidebar:', error));
}