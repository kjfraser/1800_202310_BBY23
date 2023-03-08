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
insertName(); //run the function

function populateHazards() {
    let hazardCardTemplate = document.getElementById("hazardCardTemplate");
    let hazardCardGroup = document.getElementById("hazardCardGroup");
    
    db.collection("hazards").get()
        .then(allHazards => {
            hazards = allHazards.docs;
            console.log(hazards);
            hazards.forEach(doc => {
                var title = doc.data().title; 
                var description = doc.data().description; 
                var lat = doc.data().lat;
                var lng = doc.data().lng;
                var datetime = doc.data().datetime.toDate();
                console.log(datetime)

                let hazardCard = hazardCardTemplate.content.cloneNode(true);
                hazardCard.querySelector('.title').innerHTML = title;     
                hazardCard.querySelector('.datetime').innerHTML = new Date(datetime).toLocaleString();    
                hazardCard.querySelector('.description').innerHTML = `Description: ${description}`;
                hazardCard.querySelector('.lat').innerHTML = `Latitude: ${lat}`;
                hazardCard.querySelector('.lng').innerHTML = `Longitude: ${lng}`;
                hazardCardGroup.appendChild(hazardCard);
            })
        })
}
populateHazards();