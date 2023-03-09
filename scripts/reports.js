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
                  }).then((new_rep) => {
                    db.collection("users")
                      .doc(user.uid)
                      .update({
                        reports: firebase.firestore.FieldValue.arrayUnion(new_rep.id),
                      });
                  }).then(() => {
                      window.location.href = "thanks.html"; //new line added
                  })
              })
      } else {
          console.log("No user is signed in");
          window.location.href = 'hazard-report.html';
      }
  });
}