# Star Tribune Fatal Encounters Database v3.0

This is a database of everyone who died in encounters with police officers across Minnesota since the year 2000. The data are derived from death records and media reports and fed into a live Google Sheet.

## History

This was initially developed for the project "A Cry For Help" but launched early in November 2015 immediately following the police-involved death of Jamar Clark in Minneapolis. That version was functional but held together by hope, tape and staples, and built mostly using D3, jQuery, HTML and CSS, with data fed from a Google Sheet so reporters could update the database in real time.

The next version was specifically crafted to run within the "A Cry For Help" package in 2016 and meticulously designed with that project's visual language, needed functionality and storytelling focus in mind, placing an emphasis not just on racial disparities associated with police-involved killings, but upon mental health crises among those who died. This version was also developed before any vital technological infracture was allotted to metro, so many of its resources lived outside the Star Tribune's ecosystem, leaving it vulnerable to the digital entropy that eventually claimed it.

Post-project, this was redeveloped into a stand-alone, ongoing record of police-involved killings in Minnesota as a piece of public service journalism. We lacked easily-accessible special templates, and remained trapped within an iframe-centric world.

As the Star Tribune's technological prowess evolved and newsroom development matured, it was necessary to keep this project running in response to changes in digital ecosystems. This involved patching the project and subjecting it to ongoing feature and design creep.

In 2018-2019, as the Star Tribune newsroom adopted modern development workflows, the project was ported to a [generator-striblab](https://github.com/striblab/generator-striblab) instance where it could breathe outside of iframes with the help of backend solutions like Directus to feed LCD template overrides. While this modernized the project in significant ways, the core D3-powered code remained largely unchanged from 2015, so keeping it running and adding new features became increasingly challenging.

In 2022, development on a new from-scratch version of the project began with an eye upon reimagining the database based on seven years of reader feedback and development lessons learned.

## Changes

Key upgrades and changes in this version:

* Rendered primarily by Svelte/JavaScript (instead of D3.js libraries)
* Trend chart displays vertically instead of horizontally, and adds new years automagically (solving the annual design struggle to fit a new year of records)
* Desktop display is completely responsive (nixing the need for mobile fallback displays)
* Photos are stored locally in project (instead of drawing from multiple broken internal media server URLs)
* Photos have a standardized naming convention (FirstnameLastname.jpg)
* Profile cards expand onclick in-page (replacing JS lightbox solutions adopted for iframes)
* Database filters streamlined into a single list (instead of a multiview menu requiring a half-dozen clicks)
* Database filters integrated with contextual demographic statistics (information demanded by readers for years)
* Adds a map of police-involved killings for geographic analysis


## Things to fix

* Better, more intuitive UI design
* Styling interface elements onclick to signal current views
* Filters and search work off jQuery instead of Svelte (I don't mind jQuery, but the developer world seems to have declared holy war against it)
* Allow for links to multiple related news stories for each profile
* Clicking the profile card expand button should scroll page to focus on the card
* Optimize design of profile cards into something sleeker with more insightful information
* Needs top-to-bottom restyling with digital designer input
* There are probably 36 quadrillion mobile design fixes to make, it should be stress-tested across devices
* Map draws from a local GEOJSON file that has to be manually generated – perhaps automate in some way?
* Revisit and streamline how new entries are added, especially with localized photos


## About the Svelte App

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/striblab/svelte3-template-webpack and is a fork of https://github.com/sveltejs/template-webpack.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit striblab/svelte3-template-webpack svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start webpack:

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. Edit a component file in `src`, save it, and the page should reload with your changes.


## Deploying to the web

```bash
npm run deploy
```

Or, some other suggestions from Rich Harris:

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
now
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public
```
