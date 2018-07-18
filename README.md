# project structure

```
myproject
 +- .firebaserc    # Hidden file that helps you quickly switch between
 |                 # projects with `firebase use`
 |
 +- firebase.json  # Describes properties for your project
 |
 +- functions/     # Directory containing all your functions code
      |
      +- package.json  # npm package file describing your Cloud Functions code.
      |
      +- tsconfig.json # Config file containing compiler options.
      |
      +- tslint.json   # Optional file containing rules for TypeScript linting.
      |
      +- src/     # Directory containing TypeScript source
      |   |
      |   +- index.ts     # main source file for your Cloud Functions code
      |
      +- lib/
          |
          +- index.js     # JavaScript output from TypeScript source.
          |
          +- index.js.map # Sourcemap file for TypeScript source.
```