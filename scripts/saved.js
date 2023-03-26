// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Get a reference to Firestore database
var db = firebase.firestore();

// This function is the only function that's called.
// This strategy gives us better control of the page.
function doAll() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // Call getBookmarks function with the authenticated user
      getBookmarks(user);
    } else {
      console.log("No user is signed in");
    }
  });
}

// This function takes input param User's Firestore document pointer
// and retrieves the "bookmarks" array (of bookmarked hikes) 
// and dynamically displays them in the gallery
function getBookmarks(user) {
  db.collection("users").doc(user.uid).get()
    .then(userDoc => {
      // Get the Array of bookmarks
      var bookmarks = userDoc.data().bookmarks;
      console.log(bookmarks);

      // Get a reference to the template element
      let cardTemplate = document.getElementById("savedCardTemplate");

      // Iterate through the ARRAY of bookmarked hikes (document ID's)
      bookmarks.forEach(bookmarks => {
        console.log(bookmarks);
        db.collection("users").doc(bookmarks).get().then(doc => {
          var title = doc.data().title; 
          var description = doc.data().description; 
          var lat = doc.data().lat;
          var lng = doc.data().lng;
          var timestamp = doc.data().timestamp.toDate();
          var hazardID = doc.id;
          var hazardimg = doc.data().image;

          // Clone the template element to create a new card
          let card = cardTemplate.content.cloneNode(true);

          // Update the content of the card with data from the Firestore document
          card.querySelector('.title').innerHTML = title;     
          card.querySelector('.timestamp').innerHTML = new Date(timestamp).toLocaleString();    
          card.querySelector('.description').innerHTML = `Description: ${description}`;
          card.querySelector('.lat').innerHTML = `Latitude: ${lat}`;
          card.querySelector('.lng').innerHTML = `Longitude: ${lng}`;
          card.querySelector('#more').href = "hazard-page.html?hazard=" + hazardID;
          card.getElementById('card-image card-img-top').src = hazardimg;
                   
                    
										//Finally, attach this new card to the gallery
             hazardCardGroup.appendChild(card);
                })
            });
        })
}