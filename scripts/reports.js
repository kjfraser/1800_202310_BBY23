

//Works like a charm
function createHazardReport(){
  var reports = db.collection("hazards");
  
    reports.add({
      title: "default",
      location: 0.1
    })
  }




function createHTMLReport(title){
  document.getElementById("reports-list").innerHTML += title;
}

function loadReportsList(){
  firebase.auth().onAuthStateChanged(user => {
    if (user){
      db.collection("users").doc(user.uid).get().then((user) => {
        var reports = user.data().reports;
        reports.forEach(repID => {
          db.collection("hazards").doc(repID).get().then((report) => {

            let title = report.data().title;
            createHTMLReport(title);
          });
        });
      })
    }
  })
}
loadReportsList();

