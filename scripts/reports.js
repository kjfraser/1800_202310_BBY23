


// document.getElementById("title").onclick = "listenTitleChange()";
document.getElementById("create-report").disabled = true;
var ImageFile;

function listenTitleChange() {
  document.getElementById("create-report").disabled = !canSubmit();
}

function canSubmit(){
  return document.getElementById("title").value != "" && document.getElementById("mypic-goes-here").src != "";
}

function listenFileSelect() {
  // listen for file selection
  var fileInput = document.getElementById("mypic-input"); // pointer #1
  const image = document.getElementById("mypic-goes-here"); // pointer #2
  
  // When a change happens to the File Chooser Input
  fileInput.addEventListener('change', function (e) {
    ImageFile = e.target.files[0];   //Global variable
    var blob = URL.createObjectURL(ImageFile);
    image.src = blob; // Display this image
    
    document.getElementById("create-report").disabled = !canSubmit();
    
  })
}
listenFileSelect();

function writeHazardReport() {
  if(!canSubmit()){
    document.getElementById("create-report").disabled = !canSubmit();
    return;
  }
  document.getElementById("create-report").disabled = true;
  let input_title = document.getElementById("title").value;
  let Description = document.getElementById("description").value;
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("users").doc(user.uid).get()
        .then((userDoc) => {
          db.collection("hazards").add({
            userID: user.uid,
            title: input_title,
            description: Description,
            lng: userLng,
            lat: userLat,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
            .then(doc => {
              uploadPic(doc.id, () => {
                db.collection("users")
                .doc(user.uid)
                .update({
                  reports: firebase.firestore.FieldValue.arrayUnion(doc.id),
                })
                .then(() => {
                  window.location.href = 'thanks.html';
                })
              });
    
            
            })
        })
    } else {
      console.log("No user is signed in");
      window.location.href = 'hazard-report.html';
    }
  });
}



//DO NOT DELETE.
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

function uploadPic(postDocID, callback) {
    var storageRef = storage.ref("images/" + postDocID + ""); //TODO: If it stops working add .jpg

  storageRef.put(ImageFile)   //global variable ImageFile
    .then(function () {
      storageRef.getDownloadURL()
        .then(function (url) { // Get URL of the uploaded file
          db.collection("hazards").doc(postDocID).update({
            "image": url // Save the URL into users collection
          })
            .then(function () {
              callback();
            })
        })
    })
    .catch((error) => {
      callback();
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