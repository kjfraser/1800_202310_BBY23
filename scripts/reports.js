//Works like a charm
function createHazardReport() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("hazards")
        .add({
          title: "default",
          description: "default",
          lng: userLng,
          lat: userLat,
          datetime: firebase.firestore.FieldValue.serverTimestamp(),
          owner: user.uid,
        })
        .then((new_rep) => {
          db.collection("users")
            .doc(user.uid)
            .update({
              reports: firebase.firestore.FieldValue.arrayUnion(new_rep.id),
            });
        });
    }
  });
}

function createHTMLReport(title) {
  document.getElementById("reports-list").innerHTML += title;
}

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

function loadCurrentUserReports() {
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
                if (report && report.data()) {
                  let title = report.data().title;
                  //Do other stuff
                }
              });
          });
        });
    }
  });
}
loadCurrentUserReports();
