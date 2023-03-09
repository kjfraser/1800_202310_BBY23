// //Works like a charm
// function createHazardReport() {
//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       db.collection("hazards")
//         .add({
//           title: "default",
//           description: "default",
//           lng: userLng,
//           lat: userLat,
//           datetime: firebase.firestore.FieldValue.serverTimestamp(),
//           owner: user.uid,
//         })
//         .then((new_rep) => {
//           db.collection("users")
//             .doc(user.uid)
//             .update({
//               reports: firebase.firestore.FieldValue.arrayUnion(new_rep.id),
//             });
//         });
//     }
//   });
// }

// function createHTMLReport(title) {
//   document.getElementById("reports-list").innerHTML += title;
// }

// function loadCurrentUserReports() {
//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       db.collection("users")
//         .doc(user.uid)
//         .get()
//         .then((user) => {
//           var reports = user.data().reports;
//           reports.forEach((repID) => {
//             db.collection("hazards")
//               .doc(repID)
//               .get()
//               .then((report) => {
//                 if (report && report.data()) {
//                   let title = report.data().title;
//                   //Do other stuff
//                 }
//               });
//           });
//         });
//     }
//   });
// }
// loadCurrentUserReports();

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
    console.log("inside write review")
    let Title = document.getElementById("title").value;
    let Description = document.getElementById("description").value;
    console.log(Title, Description);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("hazards").add({
                        userID: userID,
                        title: Title,
                        description: Description,
                        lng: userLng,
                        lat: userLat,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(doc => {
                        console.log(doc.id);
                        uploadPic(doc.id);
                    }).then((new_rep) => {
                        db.collection("users")
                            .doc(user.uid)
                            .update({
                                reports: firebase.firestore.FieldValue.arrayUnion(new_rep.id),
                            });
                    })
                    .then(() => {
                        //window.location.href = "thanks.html"; //new line added
                    })
                })
        } else {
            console.log("No user is signed in");
            window.location.href = 'hazard-report.html';
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