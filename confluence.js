var request = require('request');
var fs = require('fs');
var Promise = require('promise');

function getBasicAuth(username, password) {
  return 'Basic ' + new Buffer(username + ':' + password).toString('base64')
}

function newPageTemplate(space, title, content, parentId) {
  return {
    type:"page",
    title:title,
    ancestors:[{id:parentId}],
    space:{key:space},
    body:{
      storage:{
        value:content,
        representation:"storage"
      }
    }
  };
}


var Confluence = function (basepath, username, password, space) {
  this.basepath = basepath;
  this.username = username;
  this.password = password;
  this.space = space;
};

Confluence.prototype.getPage = function(title, space) {
  var self = this;
  var auth = getBasicAuth(self.username, self.password);
  var promise = new Promise(function(resolve, reject) {
    request({
      headers: {
          'Authorization': auth
      },
      uri: self.basepath + 'rest/api/content/?title=' + title + '&spaceKey=' + space + '&expand=history',
      method: 'GET'
    }, function (error, response, body) {
      var result = JSON.parse(body);
      if(result.size > 0) {
        resolve(result.results[0].id);
      } else {
        resolve();
      }
    });
  });
  return promise;
}

Confluence.prototype.copyPage = function (title, pageId, newParentId) {
  var self = this;
  var auth = getBasicAuth(self.username, self.password);
  var promise = new Promise(function(resolve, reject) {
    request({
      headers: {
          'Content-Type': 'application/json',
          'Authorization': auth
      },
      uri: self.basepath + 'rest/api/content/' + pageId + '?expand=body.storage',
      method: 'GET'
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var template = JSON.parse(body);
        var newpage = newPageTemplate(self.space, title, template.body.storage.value, newParentId);

        request({
          headers: {
              'Content-Type': 'application/json',
              'Authorization': auth
          },
          uri: self.basepath + 'rest/api/content/',
          body: JSON.stringify(newpage),
          method: 'POST'
        }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("Created newpage");
            var newpage = JSON.parse(body);
            resolve(newpage.id);
          } else {
            console.log("Failed to create newpage: " + body);
            reject(error);
          }
        });
      }
    });
  });
  return promise;
};

Confluence.prototype.attachFile = function (filename, pageId) {
  var self = this;
  var auth = getBasicAuth(self.username, self.password);
  var promise = new Promise(function(resolve, reject) {

    var formdata = {
      file: fs.createReadStream(filename)
    };

    console.log("Starting upload of file: " + filename + " to page: " + pageId);

    request({
      headers: {
          'X-Atlassian-Token': 'no-check',
          'Authorization': auth
      },
      uri: self.basepath + 'rest/api/content/' + pageId + '/child/attachment',
      formData: formdata,
      method: 'POST'
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("File uploaded");
        var newpage = JSON.parse(body);
        resolve(newpage);
      } else {
        if(error) {
          console.log("Failed to upload newfile: " + error);
        } else {
          console.log(response);
        }
        reject(error);
      }
    });
  });
  return promise;
};

module.exports = Confluence;
