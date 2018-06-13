# Notes
* `dir` tag must be specified on body for this library to work

## Local Testing
If you would like to test changes to the picker from within a consumer application, follow these steps:

1. Build the picker with `npm static-content-build`
2. Point to your local copy of the picker from within the consumer application:
    * Navigate to the consumer's package.json
    * Find onenotepicker and replace the version number with the relative filepath like this: 
        * `"onenotepicker": "file:../OneNotePicker-JS"`
    * npm install / yarn install from the consumer to source the local picker project.
3. Every time you make a change to the picker, you will need to build the picker (step 1) and npm install.
