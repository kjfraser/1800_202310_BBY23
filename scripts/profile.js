
var currentUser;          //put this right after you start script tag before writing any functions.

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userEmail = userDoc.data().email;
                   

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById('nameInput').value = userName;
                    }
                    if (userEmail != null) {
                        document.getElementById('emailInput').value = userEmail;
                    }
                    
                })
        } else {
            // No user is signed in.
            console.log ("No user is signed in");
        }
    });
}

populateUserInfo();

function loadUserReportsList() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((user) => {
          var reports = user.data().reports;
          reports.forEach((repID) => {
            db.collection("hazards")
              .doc(repID)
              .get()
              .then((report) => {
                let title = report.data().title;
                createHTMLReport(title);
              });
          });
        });
    }
  });
}