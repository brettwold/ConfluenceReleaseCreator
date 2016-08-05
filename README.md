# ConfluenceReleaseCreator

A simple node script to create a release page on confluence from a template and
then upload an attachment to that page. If the page already exists then it will
be re-used and only the attachment uploaded.

## Usage

createconfpage -p={targetParentPageId} -t={pageTitle} -a={uploadFileName}

Where:

targetParentPageId - The page id of the parent page to create this new page under
pageTitle - The new page title to create
uploadFileName - The full filename/path to the file to attachment

### Environment Variables

As well as this various configuration parameters must also be specified. These
can be defined as environment variables or contained in a config file named
confpage.json.


CONF_USER - The username of a Confluence user under which to perform all operations
CONF_PASSWORD - The password of the user
CONF_TEMPLATE_ID - The page id of a page to use as a template for the new page (all content will be copied)
CONF_BASE_URL - The base URL of your confluence instance e.g. https://myconf.atlassian.net/wiki/
CONF_SPACE - The space name under which the new page is to be created

confpage.json format:

```json
{
  "CONF_USER": "My.Username",
  "CONF_PASSWORD": "{xxx_password_xxx}",
  "CONF_TEMPLATE_ID": "{xxx_template_id_xxx}",
  "CONF_BASE_URL": "https://myconfluence.atlassian.net/wiki/",
  "CONF_SPACE": "MYSPACENAME"
}
```
