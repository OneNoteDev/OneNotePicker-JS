# Notes
* `dir` tag must be specified on body for this library to work

## Local Testing
If you would like to test changes to the picker from within a consumer application, follow these steps:

1. Run `yarn` to install dependencies
2. Build the picker with `yarn run build`
3. To test it in another application, you can either use yarn link, publish an adhoc package, or copy the contents of dist into your project's node_modules

## Publishing

Remember to build the project before publishing with `npm publish`