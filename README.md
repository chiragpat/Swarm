Swarm
===

Multiplayer game built using HTML5 and node.js.
[Live Version Here](http://swarm.jit.su)

## Installation

1. Install [nodejs](https://github.com/joyent/node) and [npm](https://github.com/isaacs/npm)
2.
        git clone git@github.com:chiragpat/Swarm.git
3. Run npm install to install dependencies
4. Set environment variable SWARM_DB_URL to the url of your mongo database.

## Quick Start
To start game server 

    $ node app.js

Then go to URL

    http://localhost:3000

To change ports add environment variable PORT with the port you want to run the app on.

## Running Tests
    $ make test