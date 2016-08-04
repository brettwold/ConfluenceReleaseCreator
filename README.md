# ConfluenceReleaseCreator

A simple node script to create a release page on confluence from a template and
then upload an attachment to that page. If the page already exists then it will
be re-used and only the attachment uploaded.

## Usage

createconfpage targetParentPageId pageTitle uploadFileName username password template basepath space

Where:

targetParentPageId - The page id of the parent page to create this new page under
pageTitle - The new page title to create
uploadFileName - The full filename/path to the file to attachment
username - The username of a Confluence user under which to perform all operations
password - The password of the user
template - The page id of a page to use as a template for the new page (all content will be copied)
basepath - The base URL of your confluence instance e.g. https://myconf.atlassian.net/wiki/
space - The space name under which the new page is to be created
