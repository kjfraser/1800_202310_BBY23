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
      hazards.forEach((doc) => {
        var title = doc.data().title;
        var description = doc.data().description;
        var timestamp = doc.data().timestamp.toDate();
        var hazardID = doc.id;
        let hazardCard = hazardCardTemplate.content.cloneNode(true);
        let hazardimg = doc.data().image;
        hazardCard.querySelector(".title").innerHTML = title;
        hazardCard.querySelector(".timestamp").innerHTML = new Date(
          timestamp
        ).toLocaleString();
        hazardCard.querySelector(
          ".description"
        ).innerHTML = `Description: ${description}`;
        hazardCard.querySelector("#more").href =
          "hazard-page.html?hazard=" + hazardID;
        hazardCard.getElementById("card-image card-img-top").src = hazardimg;

        hazardCard.querySelector("i").id = "save-" + hazardID;
        hazardCard.querySelector("i").onclick = () => saveBookmark(hazardID);

        currentUser.get().then((userDoc) => {
          //get the user name
          var bookmarks = userDoc.data().bookmarks;
          if (bookmarks.includes(hazardID)) {
            document.getElementById("save-" + hazardID).innerText = "bookmark";
          }
        });

        hazardCardGroup.appendChild(hazardCard);
      });
    });
}

function saveBookmark(hazardID) {
  currentUser.set({
    bookmarks: firebase.firestore.FieldValue.arrayUnion(hazardID)
}, {
    merge: true
})
.then(function () {
    console.log("bookmark has been saved for: " + currentUser);
    var iconID = 'save-' + hazardID;
    //console.log(iconID);
    //this is to change the icon of the hike that was saved to "filled"
    document.getElementById(iconID).innerText = 'bookmark';
});
}
