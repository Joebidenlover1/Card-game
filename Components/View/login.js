function attemptLogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("error-message");

    if (!username || !password) {
        errorMessage.textContent = "Please enter both username and password.";
        errorMessage.style.display = "block";
        return;
    }

    fetch("http://localhost:63342/htdocs/Card-game/Components/View/login.html", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                window.location.href = "index.html";
            } else {
                errorMessage.textContent = data.message;
                errorMessage.style.display = "block";
            }
        })
        .catch(error => console.error("Error:", error));
}
