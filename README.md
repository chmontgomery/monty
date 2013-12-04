# About #

* Web app that polls various bloom systems and reports on build statuses, OE statistics, etc.
* Runs as a simple web server on top of [nodejs](http://nodejs.org/).

# Quick Start #

1. if you don't have them already, install [nodejs](http://nodejs.org/) and [bower](http://bower.io/)
2. clone repo
3. <code>cd monty_dashboard</code>
4. install [npm](https://npmjs.org/) dependencies
    * <code>npm install</code>
5. install [bower](http://bower.io/) dependencies
    * <code>bower install</code>
5. Apply SSL patch for splunk-sdk
    * <code>grunt exec:patch_splunk</code>
6. Build generated artifacts
    * <code>grunt build</code>
7. launch web server
    * <code>node server.js</code>
8. visit [http://localhost:1337/](http://localhost:1337/)

# Targets #

This project uses [grunt](http://gruntjs.com/) for all build tasks. The main tasks are:
* build all: <code>grunt build</code>
* auto build and run tests when a file changes: <code>grunt watch</code>
* run all tests: <code>grunt test</code>

# Dev Process #

Running <code>grunt watch</code> will automatically detect changes in css, js and html files, compile them if
applicable and deploy them to <code>/dist</code>
The target will also launch a server in parallel to the main node server which is solely responsible for automatically
serving up newly changed files to your browser. All that is required is a browser plugin to respond to the changes.
I use the [LiveReload Chrome plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)

For all available tasks see <code>/Gruntfile.js</code>

# Enhancements #

* To request new features or bug fixes, add a story/bug to [project Monty in JIRA](https://bloomhealthco.atlassian.net/browse/WIN)