//This file loads all scripts that will be required for most JS pages



function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here.
            $('#navbarPrimary').load('./text/nav_after_login.html', () => {
                document.getElementById("logout").addEventListener("click", () => {
                    logout();
                });
            });
            $('#footerPrimary').load('./text/footer.html');
            
        } else {
            // No user is signed in.
            $('#navbarPrimary').load('./text/nav_before_login.html');
            $('#footerPrimary').load('./text/footer.html');
        }
    });
}
loadSkeleton(); //invoke the function

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
        window.location = "index.html";
      }).catch((error) => {
        // An error happened.
      });
}

