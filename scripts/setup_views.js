var dotenv = require('dotenv');
dotenv.load();

var db = require("../lib/db")

var countsDDoc = {
  "views": {
    "counts": {
      "map": "function (doc, meta) { if(doc[0]) { for(var i = 0; i < doc.length; i++) { var qid = doc[i].id; var choices = doc[i].choices; for(var j = 0; j < choices.length; j++) { var cid = choices[j].id; emit([qid, cid], 1); } } } }",
      "reduce": "_count"
    }
  }
}

db.setDesignDoc("ncqa", countsDDoc, function (err, data) {
  if (err) {
    console.log("failed to setup view.", err)
  } else {
    console.log("setup view done.")
  }
  db.shutdown()
})



