## Project Structure

Qlik Pulse is based on the express template to trigger command and interact with Slack backend. As the standard express template its use:
* bin/www
* routes/bot
* app.js

All the configurations sits in the config.js file, whereas the sensitive informations sits in a secret.js file not present in this repo. You can build it following the instruction [here](./installation.md). 
Almost all the support file sits in the /lib folder.

### Lib

* conversation.js: Handles all responses from users and their callback functions
* conversationalPath.js: Used by conversation.js link each user response to the next step dialogue.
* excelFile.js: Is in charge of reading all the lookup table, passing from personal informations to the belonging country
* logHandler.js: Configuration file for log4js (logging system)
* repoHandler.js: Handle the connection to the database (MySql)
* skillBot: Extend the Slack BoT class and make all the comunications with the Slack backend

[Back to home](../README.md)
