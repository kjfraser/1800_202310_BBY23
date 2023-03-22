


var ImageFile;
function listenFileSelect() {
  // listen for file selection
  var fileInput = document.getElementById("mypic-input"); // pointer #1
  const image = document.getElementById("mypic-goes-here"); // pointer #2

  // When a change happens to the File Chooser Input
  fileInput.addEventListener('change', function (e) {
    ImageFile = e.target.files[0];   //Global variable
    var blob = URL.createObjectURL(ImageFile);
    image.src = blob; // Display this image
  })
}
listenFileSelect();

function writeHazardReport() {
  let Title = document.getElementById("title").value;
  let Description = document.getElementById("description").value;
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("users").doc(user.uid).get()
        .then((userDoc) => {
          db.collection("hazards").add({
            userID: user.uid,
            title: Title,
            description: Description,
            lng: userLng,
            lat: userLat,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
            .then(doc => {
              uploadPic(doc.id);
              db.collection("users")
                .doc(user.uid)
                .update({
                  reports: firebase.firestore.FieldValue.arrayUnion(doc.id),
                })
                .then(() => {
                  window.location.href = 'thanks.html';
                });
            })
        })
    } else {
      console.log("No user is signed in");
      window.location.href = 'hazard-report.html';
    }
  });
}


//DO NOT DELTE.
function updateHazardReport(currentHazardID) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("hazards").doc(currentHazardID).get().then((currentHazard) => {
        db.collection("hazards").doc(currentHazardID).collection("history").add({
          title: currentHazard.data().title,
          description: currentHazard.data().description,
          lng: currentHazard.data().lng,
          lat: currentHazard.data().lat,
          datetime: currentHazard.data().datetime,
          owner: currentHazard.data().owner,
        })
        db.collection("hazards").doc(currentHazardID).update({
          title: "update",
          description: "default2",
          // lng: userLng,
          // lat: userLat,
          datetime: firebase.firestore.FieldValue.serverTimestamp(),
          owner: user.uid,
        })
          .then(() => {
            db.collection("users")
              .doc(user.uid)
              .update({
                reports: firebase.firestore.FieldValue.arrayUnion(currentHazardID),
              });
          });
      });
    }
  });
}

function uploadPic(postDocID) {
  console.log("inside uploadPic " + postDocID);
  var storageRef = storage.ref("images/" + postDocID + ".jpg");

  storageRef.put(ImageFile)   //global variable ImageFile
    .then(function () {
      console.log('Uploaded to Cloud Storage.');
      storageRef.getDownloadURL()
        .then(function (url) { // Get URL of the uploaded file
          console.log("Got the download URL.");
          db.collection("hazards").doc(postDocID).update({
            "image": url // Save the URL into users collection
          })
            .then(function () {
              console.log('Added pic URL to Firestore.');
            })
        })
    })
    .catch((error) => {
      console.log("error uploading to cloud storage");
    })
}

//Get User Location For Variables
navigator.geolocation.getCurrentPosition(locSuccess, locError, {
  enableHighAccuracy: true,
});
function locSuccess(position) {
  userLng = position.coords.longitude;
  userLat = position.coords.latitude;
}
function locError() {
  console.log("Error getting user position");
}