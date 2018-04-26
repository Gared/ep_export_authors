var Changeset = require("ep_etherpad-lite/static/js/Changeset");
var db = require("ep_etherpad-lite/node/db/DB").db;
//var async = require("async");

var authorColorPool = null;

exports.getLineHTMLForExport = function (hook, context) {
    var authors = _authorsOfLine(context.attribLine, context.apool);
    var newLineHTML = "";
    var charPos = 0;
    if (context.lineContent[0] === '*') {
	context.lineContent = context.lineContent.substr(1);
    }
    authors.forEach(function(author) {
      var authorName = author.name;
      var color = null;

      if (authorName) {
        authorName = authorName.replace('.','_');
        color = _getAuthorColor(author.name);
      }
      var plainAuthorText = context.text.substring(charPos, charPos + author.chars);
      var newHTML = _getHTMLString(authorName, color, plainAuthorText);
      context.lineContent = context.lineContent.replace(plainAuthorText, newHTML);
      
      var end = context.lineContent.indexOf(newHTML) + newHTML.length;
      newLineHTML += context.lineContent.substr(0, end);
      context.lineContent = context.lineContent.substr(end);

      charPos += author.chars;
    });
    if (newLineHTML === "") {
      return;
    }

    if (context.lineContent.length) {
      newLineHTML += context.lineContent;
    }
    context.lineContent = newLineHTML+'<br/>';
    return true;
}

function _authorsOfLine(alineAttrs, apool) {
  var authors = [];
  if (alineAttrs) {
    var opIter = Changeset.opIterator(alineAttrs);
    while (opIter.hasNext()) {
      var op = opIter.next();
      var author = null;
      if (op.attribs) {
        author= Changeset.attribsAttributeValue(op.attribs, "author", apool);
      }
      authors.push({ 'name': author, 'chars': op.chars});
    }
  }
  return authors;
}

function _getHTMLString(authorName, authorColor, text) {
  if (authorName) {
    return '<span class="' + authorName + '" title="' + authorName + '" style="background-color:' + authorColor + '">' + text + '</span>';
  } else {
    return '<span class="anonymous" title="anonymous">' + text + '</span>';
  }
}

function _getAuthorColor(authorName) {
  var hashKey = "authorColor:"+authorName;
  var color = "FF0000";

  if (!authorColorPool) {
    authorColorPool = [];
  }
  if (authorColorPool) {
    if (!authorColorPool[hashKey]) {
      authorColorPool[hashKey] = ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6);
    }
    color = authorColorPool[hashKey];
  }
  return "#"+color;
}

