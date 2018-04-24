# Qlik Pulse

## Installation

Clone the repository and run the `npm install`.

## Token configuration

Create a slack app and get the tokens provided. Create a file named secret.js in the root folder and fill-up the placeolder with your tokens

```javascript

/** This file contain all the Token and password not to
*  save on a public repository
*/
module.exports = {

    /** This is the connection to the local repository MySql
     * Actually the port is not yet used (Default 3306)
     */
    Repository : {
        host : "<YOU REPOSITORY HOST>",
        port : <YOUR REPOSITORY PORT>,
        user : '<YOUR REPOSITORY USER>',
        password : '<YOUR REPOSITORY PASSWORD>'
    },

    //Neo on Qlik-presales
    YOUQlik : {
        ClientID:'<Slack App ClientID Token>',
        ClientSecret:'<Slack App ClientSecret>',
        VerificationToken:'<Slack App VerificationToken>',
        AuthAccessToken : '<Slack Auth access Token>',
        token : '<Slack Token>',
        name: '<Slack Bot Name>'
    },

    // Lookup excel file from trigram to Country
    LookupTable : {
        File : "<File for lookUp trigram/country>",
        Sheet : "<Sheet Name>"
    }
}
```

[Back to home](../README.md)
