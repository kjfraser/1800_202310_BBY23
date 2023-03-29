//Global variable pointing to the current user's Firestore document
var currentUser;

//Function that calls everything needed for the main page
function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      populateHazards("hazards");
    } else {
      // No user is signed in.
      window.location.href = "login.html";
    }
  });
}
doAll();

function populateHazards() {
  let hazardCardTemplate = document.getElementById("hazardCardTemplate");
  let hazardCardGroup = document.getElementById("hazardCardGroup");

  db.collection("hazards")
    .orderBy("timestamp", "desc")
    .limit(10)
    .get()
    .then((allHazards) => {
      hazards = allHazards.docs;
      hazards.forEach((hazard) => {
        fillHazardCard(hazard.id,hazardCardTemplate,hazardCardGroup);
      });
    });
}

