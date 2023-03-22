function displayHazardInformation(){
  //retrive document id from the url
  let params = new URL(window.location.href); //get url from search bar
  let ID = params.searchParams.get("hazard");

  console.log(ID);
  db.collection("hazards").doc(ID).get().then(thisHazard => {
    hazardData = thisHazard.data();
    // hazardCode = hazardData.code;
    hazardTitle = hazardData.title;

    document.getElementById("hazardTitle").innerHTML = hazardTitle
    let imgEvent = document.querySelector( ".hike-img" );
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


// function populateReviews() {
//   let hikeCardTemplate = document.getElementById("reviewCardTemplate");
//   let hikeCardGroup = document.getElementById("reviewCardGroup");

//   //let params = new URL(window.location.href) //get the url from the searbar
//   //let hikeID = params.searchParams.get("docID");
//   var hikeID = localStorage.getItem("hikeDocID");
  
//   // doublecheck: is your collection called "Reviews" or "reviews"?
//   db.collection("reviews").where( "hikeDocID", "==", hikeID).get()
//       .then(allReviews => {
//           reviews=allReviews.docs;
//           console.log(reviews);
//           reviews.forEach(doc => {
//               var title = doc.data().title; //gets the name field
//               var level = doc.data().level; //gets the unique ID field
//               var season = doc.data().season;
//               var description = doc.data().description; //gets the length field
//               var flooded = doc.data().flooded;
//               var scrambled = doc.data().scrambled;
//               var time = doc.data().timestamp.toDate();
//               console.log(time)

//               let reviewCard = hikeCardTemplate.content.cloneNode(true);
//               reviewCard.querySelector('.title').innerHTML = title;     //equiv getElementByClassName
//               reviewCard.querySelector('.time').innerHTML = new Date(time).toLocaleString();    //equiv getElementByClassName
//               reviewCard.querySelector('.level').innerHTML = `level: ${level}`;
//               reviewCard.querySelector('.season').innerHTML = `season: ${season}`;
//               reviewCard.querySelector('.scrambled').innerHTML = `scrambled: ${scrambled}`;  //equiv getElementByClassName
//               reviewCard.querySelector('.flooded').innerHTML = `flooded: ${flooded}`;  //equiv getElementByClassName
//               reviewCard.querySelector('.description').innerHTML = `Description: ${description}`;
//               hikeCardGroup.appendChild(reviewCard);
//           })
//       })
// }
// populateReviews();