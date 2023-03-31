//Global variable pointing to the current user's Firestore document
var currentUser;

//Function that calls everything needed for the main page
function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      getBookmarks(user);
      loadUserReportsList(user);
      populateUserInfo(user);
    } else {
      // No user is signed in.
      window.location.href = "login.html";
    }
  });
}
doAll();

function populateUserInfo() {
  //go to the correct user document by referencing to the user uid
  //get the document for current user.
  currentUser.get().then((userDoc) => {
    //get the data fields of the use
    var userName = userDoc.data().name;
    var userEmail = userDoc.data().email;

    //if the data fields are not empty, then write them in to the form.
    if (userName != null) {
      document.getElementById("nameInput").value = userName;
    }
    if (userEmail != null) {
      document.getElementById("emailInput").value = userEmail;
    }
  });
}

function loadUserReportsList(user) {
  let cardTemplate = document.getElementById("hazardCardTemplate");
  let bookmarkedHazardsGroup = document.getElementById("my_reports");
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((user) => {
      var reports = user.data().reports;
      reports.forEach((hazardID) => {
        
        db.collection("hazards")
          .doc(hazardID)
          .get()
          .then((snapshot) => {
            if (!snapshot.exists) {
              currentUser.update({
                reports: firebase.firestore.FieldValue.arrayRemove(hazardID),
              });
            }else{
            fillHazardCard(hazardID, cardTemplate, bookmarkedHazardsGroup);
            }
          });
        
      });
    });
}

function getBookmarks(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      // Get the Array of bookmarks
      var bookmarks = userDoc.data().bookmarks;

      // Get pointer the new card template
      let cardTemplate = document.getElementById("hazardCardTemplate");
      let bookmarkedHazardsGroup = document.getElementById("saved_reports");

      //Delete old bookmarks
      // Iterate through the ARRAY of bookmarked hikes (document ID's)
      bookmarks.forEach((hazardID) => {
        db.collection("hazards")
        .doc(hazardID)
        .get()
        .then((snapshot) => {
          if (!snapshot.exists) {
            currentUser.update({
              reports: firebase.firestore.FieldValue.arrayRemove(hazardID),
            });
          }else{
            fillHazardCard(hazardID, cardTemplate, bookmarkedHazardsGroup);
          }
      });

      
    });
  })
}



function editUserInfo() {
  //Enable the form fields
  document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
  userName = document.getElementById('nameInput').value;       
  userEmail = document.getElementById('emailInput').value;     
  

  currentUser.update({
      name: userName,
      email: userEmail
  })
  .then(() => {
      console.log("Document successfully updated!");
  })

  document.getElementById('personalInfoFields').disabled = true;

 
}
