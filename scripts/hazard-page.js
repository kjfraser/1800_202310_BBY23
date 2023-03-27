function displayHazardInformation(){
  //retrive document id from the url
  let params = new URL(window.location.href); //get url from search bar
  let ID = params.searchParams.get("hazard");

  console.log(ID);
  db.collection("hazards").doc(ID).get().then(thisHazard => {
    hazardData = thisHazard.data();
    // hazardCode = hazardData.code;
    hazardTitle = hazardData.title;
    hazardImage = hazardData.image;

    document.getElementById("hazardTitle").innerHTML = hazardTitle;
    document.getElementById("hazardImage").src = hazardImage;

    altLat = hazardData.lat;
    altLng = hazardData.lng;
    centerOnLocation = true;
    // imgEvent.src = "../images/" + hazardCode + ".jpg";
  }
  )
}
displayHazardInformation();

function saveHazardDocumentIDAndRedirect(){
  let params = new URL(window.location.href) //get the url from the search bar
  let ID = params.searchParams.get("hazard");
  localStorage.setItem('hazardDocID', ID);
  window.location.href = 'comment.html';
}
