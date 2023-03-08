
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
