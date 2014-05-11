var Changeset = require("ep_etherpad-lite/static/js/Changeset");
var db = require("ep_etherpad-lite/node/db/DB").db;
//var async = require("async");

var authorColorPool = null;

exports.getLineHTMLForExport = function (hook, context) {
    var authors = _authorsOfLine(context.attribLine, context.apool);
    var newLineHTML = "";
    var charPos = 0;

    // Use this code if this function is called in an asynchronous way
    /*async.series([
      function(cb){
        async.each(authors, function(author, callback) {
          console.log(author);
          db.getSub("globalAuthor:" + author, ["colorId"], function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("color: "+result);
              newLineHTML += _getHTMLString(author.name.replace('.','_'), result, context.text.substring(charPos, charPos + author.chars));
              charPos += author.chars;
            }
            callback();
          });
        }, function(err) {
          if (err) {
            console.log(err);
          }
          cb();
        });
      }
    ],
    function(err, results){
      return newLineHTML+'<br/>';
    });*/

    authors.forEach(function(author) {
      var color = _getAuthorColor(author.name);
      newLineHTML += _getHTMLString(author.name.replace('.','_'), color, context.text.substring(charPos, charPos + author.chars));
      charPos += author.chars;
    });
    return newLineHTML+'<br/>';
}

function _authorsOfLine(alineAttrs, apool) {
  var authors = [];
  if (alineAttrs) {
    var opIter = Changeset.opIterator(alineAttrs);
    while (opIter.hasNext()) {
      var op = opIter.next();
      if (op.attribs) {
        var author= Changeset.attribsAttributeValue(op.attribs, "author", apool);
        authors.push({ 'name': author, 'chars': op.chars});
      }
    }
  }
  return authors;
}

function _getHTMLString(authorName, authorColor, text) {
  return '<span class="' + authorName + '" style="background-color:' + authorColor + '">' + text + '</span>';
}

function _getAuthorColor(authorName) {
  var hashKey = "authorColor:"+authorName;
  var color = "FF0000";

  if (!authorColorPool) {
    authorColorPool = [];
  }
  if (authorColorPool) {
    if (!authorColorPool[hashKey]) {
      authorColorPool[hashKey] = Math.random()*0xFFFFF<<0;
    }
    color = authorColorPool[hashKey];
    console.log(color);
  }
  return "#"+color;
}

