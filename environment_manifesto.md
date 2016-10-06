Purpose of this file is to document my personal methodology for managing
the wacky world of environment variables and config vars.

https://www.npmjs.com/package/dotenv

https://medium.com/@rafaelvidaurre/managing-environment-variables-in-node-js-2cb45a55195f#.iw4jxrv9t

1. npm install dotenv --save
2. Define a generic .env_template file which can be checked into git.
    - this will have the correct list of KEYS with bogus values
    - this list must be mimicked on Heroku
    - The template file serves as a guide for developers to know which environment variables the project needs, and also works          for setting default variables when possible.
3. Manually create following env var
        ADD TO ~/.bashrc file OR .profile for cloud9:
        - export APP_ENVFILE_DIR= <dir name > ~./app_envfile 

        --I can now say the following in app file to clarify the location of my .env file
          require('dotenv').config({path: APP_ENVFILE_DIR + '/myproject/.env'});
        
        -- This is necessary when developing in public environments like Cloud9
           an .env file in workspace  directory would be visible to the universe. If I place
           it in the 'root' or a directory above workspace, then those with 
           read only access cannot view the file.
4. mkdir ENVFILE_DIR if different than project directory
    - mkdir -p $ENVFILE_DIR
5. Make a copy of .env_template into  ENVFILE_DIR and rename to .env 
    - fill in keys with correct values
6. Add the following line to .gitignore file: .env
7. Setup dotenv in main server file.
    - https://www.npmjs.com/package/dotenv
    - npm install dotenv --save
    - require('dotenv').config({silent: true,path: ENVFILE_DIR});

 

