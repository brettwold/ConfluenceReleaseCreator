var Confluence = require('./confluence.js');
var nconf = require('nconf');
var path = require('path');

const ENV_VARIABLES = "Environment variables (or 'confpage.json') must be setup defining CONF_USER, CONF_PASSWORD, CONF_TEMPLATE_ID, CONF_BASE_URL, CONF_SPACE";

nconf.env().file(path.resolve(__dirname) + '/confpage.json');

nconf.argv({
  "p": {
    alias: 'parentPageId',
    demand: true,
    describe: 'The id of the parent page to create the new page under',
    type: 'number'
  },
  "t": {
    alias: 'title',
    demand: true,
    describe: 'The title to use for the new page',
    type: 'string'
  },
  "a": {
    alias: 'uploadFileName',
    demand: true,
    describe: 'The full filename/path of the file to attach to the page',
    type: 'string'
  }
});

try {
  nconf.required(['CONF_USER', 'CONF_PASSWORD', 'CONF_TEMPLATE_ID', 'CONF_BASE_URL', 'CONF_SPACE']);
} catch(err) {
  console.log(err);
  console.log(ENV_VARIABLES);
  process.exit(2);
}

var targetParentPageId = nconf.get("p");
var pageTitle = nconf.get("t");
var uploadFileName = nconf.get("a");

var username = nconf.get("CONF_USER");
var password = nconf.get("CONF_PASSWORD");
var template = nconf.get("CONF_TEMPLATE_ID");
var basepath = nconf.get("CONF_BASE_URL");
var space = nconf.get("CONF_SPACE");

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
