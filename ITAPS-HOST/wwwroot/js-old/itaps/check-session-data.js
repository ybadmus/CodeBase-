
//********* Log user out when user logs out **********
var userSession = JSON.parse(localStorage.getItem("userURLS"));
if (!userSession) {
    window.location = `/LandingPage`;
}

