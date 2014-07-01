# CouchQA
Sample app using couchnode to build ask "Who wants to be a millionaire" style
questions, and display the answer count.

## Setup & Run
Make sure libcouchbase is installed and get the other dependencies via

    $ npm install

configure the app via .env file, or SHELL variables, see sample.env for details

    $ cp sample.env .env
    $ $EDITOR .env

setup the needed Couchbase buckets by visiting the
[webinterface](http://localhost:8091)

setup the views, set NODE\_ENV to the environment you want the views setup for

    $ npm run setup-views

will set them up to the environment specified in .env

    $ env NODE_ENV=test npm run setup-views

will set them up for the test environment

run via the build in scripts

    $ npm start

run the tests

    $ npm test

## Why?
This app is build as an example to presented at Couchbase live London

# License
Apache

