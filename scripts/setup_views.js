var dotenv = require('dotenv');
dotenv.load();

var db = require("../lib/db")

var countsDDoc = {
  "views": {
    "counts": {
      "map": "function (doc, meta) { if(doc[0]) { for(var i = 0; i < doc.length; i++) { var qid = doc[i].id; var choices = doc[i].choices; for(var j = 0; j < choices.length; j++) { var choice = choices[j]; if(choice.state) { emit([qid, choice.id], 1); } else { emit([qid, choice.id], 0);} } } } }",
      "reduce": "_sum"
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



