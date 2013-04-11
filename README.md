Swarm
===

Multiplayer game built using HTML5 and node.js.
[Live Version Here](http://swarm.jit.su)

## Installation

1. Install [nodejs](https://github.com/joyent/node) and [npm](https://github.com/isaacs/npm)
2. Clone this repo

        $ git clone git@github.com:chiragpat/Swarm.git

3. Install dependencies
        
        $ npm install

4. Set environment variable SWARM_DB_URL to the url of your mongo database.

        $ echo "export SWARM_DB_URL=\"Your mongodb url goes here\"" >> ~/.bash_profile


## Quick Start
To start game server 

    $ node app.js

Then go to URL

    http://localhost:3000

To change ports add environment variable PORT with the port you want to run the app on.

## Running Tests
    $ make test