//Global variable pointing to the current user's Firestore document
var currentUser;   

//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);


            // the following functions are always called when someone is logged in
            insertName();
            populateHazards("hazards");
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();


function insertName() {
  firebase.auth().onAuthStateChanged(user => {
      // Check if a user is signed in:
      if (user) {
          // Do something for the currently logged-in user here: 
       //   console.log(user.uid); //print the uid in the browser console
       //   console.log(user.displayName);  //print the user name in the browser console
          user_Name = user.displayName;

          //method #1:  insert with html only
          //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
          //method #2:  insert using jquery
          $("#name-goes-here").text(user_Name); //using jquery

      } else {
          // No user is signed in.
      }
  });
}
//insertName(); //run the function

function populateHazards() {
    let hazardCardTemplate = document.getElementById("hazardCardTemplate");
    let hazardCardGroup = document.getElementById("hazardCardGroup");
    
    db.collection("hazards")
    .orderBy('timestamp', "desc")
    .limit(10)
    .get()
        .then(allHazards => {
            hazards = allHazards.docs;
            hazards.forEach(doc => {
                var title = doc.data().title; 
                var description = doc.data().description; 
                var lat = doc.data().lat;
                var lng = doc.data().lng;
                var timestamp = doc.data().timestamp.toDate();
                var hazardID = doc.id;
                let hazardCard = hazardCardTemplate.content.cloneNode(true);
                let hazardimg = doc.data().image;
                hazardCard.querySelector('.title').innerHTML = title;     
                hazardCard.querySelector('.timestamp').innerHTML = new Date(timestamp).toLocaleString();    
                hazardCard.querySelector('.description').innerHTML = `Description: ${description}`;
                hazardCard.querySelector('.lat').innerHTML = `Latitude: ${lat}`;
                hazardCard.querySelector('.lng').innerHTML = `Longitude: ${lng}`;
                hazardCard.querySelector('#more').href = "hazard-page.html?hazard=" + hazardID;
                hazardCard.getElementById('card-image card-img-top').src = hazardimg;
               
                hazardCard.querySelector('i').id = 'save-' + hazardID;          
                hazardCard.querySelector('i').onclick = () => saveBookmark(hazardID);

                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(hazardID)) {
                       document.getElementById('save-' + hazardID).innerText = 'bookmark';
                    }
              })
            
                hazardCardGroup.appendChild(hazardCard);
            })
        })
}
//populateHazards();


function saveBookmark(hazardID) {
    currentUser.set({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(hazardID)
        }, {
            merge: true
        })
        .then(function () {
            console.log("bookmark has been saved for: " + currentUser);
            var iconID = 'save-' + hazardID;
            //console.log(iconID);
						//this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}