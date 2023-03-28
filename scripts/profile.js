//Global variable pointing to the current user's Firestore document
var currentUser;

//Function that calls everything needed for the main page
function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      getBookmarks(user);
      loadUserReportsList(user);
    } else {
      // No user is signed in.
      window.location.href = "login.html";
    }
  });
}
c

function loadUserReportsList(user) {
  let newcardTemplate = document.getElementById("hazardCardTemplate");
  let bookmarkedHazardsGroup = document.getElementById("my_reports");
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((user) => {
          var reports = user.data().reports;
          reports.forEach((repID) => {
            fillHazardCard(repID,newcardTemplate,bookmarkedHazardsGroup);
            db.collection("hazards").doc(repID).get().then((doc) => {
      
              console.log(repID.date().title);

              }).catch(error =>{
                console.log(repID);
                db.collection("users").doc(user.uid).update({
                  reports: firebase.firestore.FieldValue.arrayRemove(repID),
                })
              });
          });
        });

}

function getBookmarks(user) {
  db.collection("users").doc(user.uid).get()
      .then(userDoc => {

          // Get the Array of bookmarks
          var bookmarks = userDoc.data().bookmarks;
          
          // Get pointer the new card template
          let newcardTemplate = document.getElementById("hazardCardTemplate");
          let bookmarkedHazardsGroup = document.getElementById("saved_reports");

          // Iterate through the ARRAY of bookmarked hikes (document ID's)
          bookmarks.forEach(hazardID => {
            fillHazardCard(hazardID, newcardTemplate, bookmarkedHazardsGroup);
          });
      })
}

function fillHazardCard(hazardID, template, group){
  db.collection("hazards").doc(hazardID).get().then(hazardDoc => {
    
    //clone the new card
    let hazardCard = template.content.cloneNode(true);

    //update title and some pertinant information
    var title = hazardDoc.data().title; 
    var description = hazardDoc.data().description; 
    var timestamp = hazardDoc.data().timestamp.toDate();
    let hazardimg = hazardDoc.data().image;
    hazardCard.querySelector('.title').innerHTML = title;     
    hazardCard.querySelector('.timestamp').innerHTML = new Date(timestamp).toLocaleString();    
    hazardCard.querySelector('.description').innerHTML = `Description: ${description}`;
    hazardCard.querySelector('#more').href = "hazard-page.html?hazard=" + hazardID;
    hazardCard.getElementById('card-image card-img-top').src = hazardimg;

    //Shows that card has been saved.
    hazardCard.querySelector("i").id = "save-" + hazardID;
    hazardCard.querySelector("i").onclick = () => saveBookmark(hazardID);

    currentUser.get().then((userDoc) => {
      //get the user name
      var bookmarks = userDoc.data().bookmarks;
      if (bookmarks.includes(hazardID)) {
        document.getElementById("save-" + hazardID).innerText = "bookmark";
      }
    });

    //Finally, attach this new card to the gallery
    group.appendChild(hazardCard);
})
}