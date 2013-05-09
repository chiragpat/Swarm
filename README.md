Swarm      
===
[![Build Status](https://api.travis-ci.org/chiragpat/Swarm.png)](http://travis-ci.org/chiragpat/Swarm)


Multiplayer game built using HTML5 and node.js.
[Live Version Here](http://swarm.jit.su)

## Features to Check Out

The system is pretty simple from the outside, so I think you will notice all of the features.

1. User Accounts
2. Live Multiplayer and Practice Modes
3. Motions, Gameplay, and Graphics

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