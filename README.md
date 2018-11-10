# Notes
* `dir` tag must be specified on body for this library to work

## Local Testing
If you would like to test changes to the picker from within a consumer application, follow these steps:

1. Build the picker with `npm static-content-build`
2. Point to your local copy of the picker from within the consumer application:
    * Navigate to the consumer's package.json
    * Find onenotepicker and replace the version number with the relative filepath to the picker root like this: 
        * `"onenotepicker": "file:../OneNotePicker-JS"`
    * `npm install` / `yarn` from the consumer to source the local picker project.
3. Create a symlink to your local picker package.
    * Run `npm link` inside the picker project.
    * Navigate to the root of the consumer application.
    * Run `npm link <relative path to picker root>`
4. Every time you make a change to the picker, you will need to build the picker (step 1).

## Publishing

Remember to build the project before publishing. 
