var Confluence = require('./confluence.js');


if(process.argv.length < 9) {
  console.log("Usage: createconfpage targetParentPageId pageTitle uploadFileName username password template basepath space");
  process.exit(1);
}

var targetParentPageId = process.argv[2];
var pageTitle = process.argv[3];
var uploadFileName = process.argv[4];
var username = process.argv[5];
var password = process.argv[6];
var template = process.argv[7];
var basepath = process.argv[8];
var space = process.argv[9];

var confluence = new Confluence(basepath, username, password, space);

function uploadFile(filename, pageId) {
  confluence.attachFile(filename, pageId).then(function(result) {
    console.log(result);
  });
}

confluence.getPage(pageTitle, space).then(function(pageId) {
  if(!pageId) {
    console.log("Creating new page with title " + pageTitle);
    confluence.copyPage(pageTitle, template, targetParentPageId).then(function(pageId) {
      uploadFile(uploadFileName, pageId);
    });
  } else {
    console.log("Got existing page: " + pageId);
    uploadFile(uploadFileName, pageId);
  }
});
