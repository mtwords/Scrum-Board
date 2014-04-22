# Scrum Board
A simple scrum board written with node.js and backbone.js.

A running sample can be found on http://warm-scrubland-7411.herokuapp.com/

## Setup
Install dependencies with

```
npm install
```

## Technologies
- node.js with express
- backbone.js
- bootstrap

## Features
- known "todo", "in progress" and "done" categories
- add: click [Add Task] to add a new task / card
- edit: use double-click to edit / delete an existing task

## Known problems
- app doesn't show tasks / cards on startup --> remove #all suffix in url and click [Show all Tasks]
- app doesn't refresh edited tasks automatically

## Coming up
- drag & drop support
