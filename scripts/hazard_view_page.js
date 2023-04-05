
function displayHazardInformation(){
  //retrive document id from the url
  let params = new URL(window.location.href); //get url from search bar
  let ID = params.searchParams.get("hazard");

  db.collection("hazards").doc(ID).get().then(thisHazard => {
    hazardData = thisHazard.data();
    // hazardCode = hazardData.code;
    hazardTitle = hazardData.title;
    hazardDescription = hazardData.description;
    hazardImage = hazardData.image;
    hazardTimestamp = hazardData.timestamp.toDate();

    document.getElementById("hazardTitle").innerHTML = hazardTitle;
    document.getElementById("hazardDescription").innerHTML = hazardDescription;
    document.getElementById("hazardImage").src = hazardImage;
    document.getElementById("hazardTimestamp").innerHTML = "Last Updated: " + new Date(hazardTimestamp).toLocaleString();

    altLat = hazardData.lat;
    altLng = hazardData.lng;
    centerOnLocation = true;
  })
}
displayHazardInformation();

function saveHazardDocumentIDAndRedirect(){
  let params = new URL(window.location.href) //get the url from the search bar
  let ID = params.searchParams.get("hazard");
  localStorage.setItem('hazardDocID', ID);
  window.location.href = 'comment.html';
}

function loadUpdateHazardPage(){
  let params = new URL(window.location.href) //get the url from the search bar
  let ID = params.searchParams.get("hazard");
  localStorage.setItem('hazardDocID', ID);
  window.location = "hazard-update.html?hazard=" + ID;
}

function showDeleteButton(){
  console.log("hello");
  let params = new URL(window.location.href);
  let ID = params.searchParams.get("hazard");
  db.collection("hazards").doc(ID).get().then(thisHazard => {
    hazardData = thisHazard.data();
    console.log(hazardData.id);
    if(currentUser){
      if(currentUser.id == hazardData.userID){
        document.getElementById("delete-button").style.display = 'block';
        console.log("hyuck");
      }else{
        document.getElementById("delete-button").style.display = 'none';
        console.log("giddyup");
      }
    }
  });
}
showDeleteButton();