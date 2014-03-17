# CouchQA
Sample app using couchnode to build ask "Who wants to be a millionaire" style
questions, and display the answer count.

## Setup & Run
Make sure libcouchbase is installed and get the other dependencies via

    $ npm install

configure the app via .env file, or SHELL variables, see sample.env for details

    $ cp sample.env .env
    $ $EDITOR .env

run via the build in scripts

    $ npm start

run the tests

    $ npm test

## Why?
This app is build as an example to presented at Couchbase live London

# License
Apache

