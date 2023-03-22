


function loadUserReportsList() {
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
                let title = report.data().title;
                createHTMLReport(title);
              });
          });
        });
    }
  });
}