//This file loads all scripts that will be required for most JS pages

function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Do something for the user here.
      $("#navbarPrimary").load("./text/nav_after_login.html", () => {
        document.getElementById("logout").addEventListener("click", () => {
          logout();
        });
      });
      $("#footerPrimary").load("./text/footer.html");
    } else {
      // No user is signed in.
      $("#navbarPrimary").load("./text/nav_before_login.html");
      $("#footerPrimary").load("./text/footer.html");
    }
  });
}
loadSkeleton(); //invoke the function

function authenticate() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      window.location = "main.html";
    }
  });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location = "index.html";
    })
    .catch((error) => {
      // An error happened.
    });
}

function fillHazardCard(hazardID, template, group) {
  db.collection("hazards")
    .doc(hazardID)
    .get()
    .then(async (hazardDoc) => {
      //clone the new card
      let hazardCard = template.content.cloneNode(true);
      //update title and some pertinant information
      var title = hazardDoc.data().title;
      var description = hazardDoc.data().description;
      var timestamp = hazardDoc.data().timestamp.toDate();
      var hazardimg = hazardDoc.data().image;
      var user;
      //get the user name
      await db
        .collection("users")
        .doc(hazardDoc.data().userID)
        .get()
        .then((userDoc) => {
          user = userDoc;
        })
        .catch(() => {
          user = "user unknown";
        });

      hazardCard.querySelector(".user").innerHTML =
        "posted by: " + user.data().name;
      hazardCard.querySelector(".title").innerHTML = title;
      hazardCard.querySelector(".timestamp").innerHTML = new Date(
        timestamp
      ).toLocaleString();

      //Fill Ins
      hazardCard.querySelector(
        ".description"
      ).innerHTML = `Description: ${description}`;
      hazardCard.querySelector("#more").href =
        "hazard_view_page.html?hazard=" + hazardID;
      hazardCard.getElementById("card-image card-img-top").src = hazardimg;

      //Shows that card has been saved.
      hazardCard.querySelector("i").parentElement.className =
        "save-" + hazardID;
      hazardCard.querySelector("i").onclick = () => updateBookmark(hazardID);
      currentUser.get().then((userDoc) => {
        //Set Bookmark flags
        var bookmarks = userDoc.data().bookmarks;
        if (bookmarks.includes(hazardID)) {
          setBookMarkFlag(hazardID, "bookmark");
        }
      });

      //Finally, attach this new card to the gallery
      group.appendChild(hazardCard);
    });
}

function updateBookmark(hazardID) {
  currentUser.get().then((userDoc) => {
    bookmarksNow = userDoc.data().bookmarks;
    //check if this bookmark already existed in firestore:
    if (bookmarksNow && bookmarksNow.includes(hazardID)) {
      //if it does exist, then remove it
      currentUser
        .update({
          bookmarks: firebase.firestore.FieldValue.arrayRemove(hazardID),
        })
        .then(setBookMarkFlag(hazardID, "bookmark_border"));
    } else {
      //if it does not exist, then add it
      currentUser
        .set(
          {
            bookmarks: firebase.firestore.FieldValue.arrayUnion(hazardID),
          },
          {
            merge: true,
          }
        )
        .then(setBookMarkFlag(hazardID, "bookmark"));
    }
  });
}

function setBookMarkFlag(hazardID, innerText) {
  var elements = document.getElementsByClassName("save-" + hazardID);
  Array.from(elements).forEach((element) => {
    element.querySelector("i").innerText = innerText;
  });
}
