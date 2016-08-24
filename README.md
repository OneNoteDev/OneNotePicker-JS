# OneNotePicker-JS
A JavaScript UI component that allows a user to choose one of their Notebook Sections
For example, this is consumed in https://github.com/OneNoteDev/WebClipper

## Setup
### 1. Install npm -- https://nodejs.org/en/download/

### 2. Install gulp globally:
```sh
$ npm install --global gulp
```
(Note: on windows, you also need to add "%appdata%\npm" to your PATH)

### 3. Install the OneNotePicker packages
From the root of this project, run:
```sh
$ npm install
```

### 4. Setup the other dependencies
From the root of this project, run:
```sh
$ gulp setup
```

### 5. Build and Test
Now just run:
```sh
$ gulp
```

## Congratulations!
At this point you should see the tests passing, and see the packaged code in the `target` folder


### Other Gulp shortcuts
#### Gulp clean
```sh
$ gulp clean
```
Removes all of the generated files from `build`, and uninstalls anything done in `setup`

#### Gulp setup
```sh
$ gulp setup
```
Installs the d.ts files and links the non-published npm packages

#### Gulp build
```sh
$ gulp build
```
(Note: this is currently the default command when you run `gulp`)
The command you will use the most often when making code changes:
 - Compiles LESS and TypeScript into /build
 - Bundles the JavaScript modules together into /bundle
 - Exports all the needed files to /target

#### Gulp runTests
```sh
$ gulp runTests
```
Run all of the unit tests on the command line
