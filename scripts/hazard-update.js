

function fillCardDefault(){
  
  db.collection("hazards").doc(localStorage.getItem('hazardDocID')).get().then((hazardDoc)=>{
    document.getElementById("title").value = hazardDoc.data().title
    if(hazardDoc.data().description != undefined){
      document.getElementById("description").value = hazardDoc.data().description;
    }

    var resolved = hazardDoc.data().resolved;
    if(resolved == undefined){
      resolved = false;
    }
    document.getElementById("is-resolved").checked = resolved;
  });
}
fillCardDefault();
