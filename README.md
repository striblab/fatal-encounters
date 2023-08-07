# Star Tribune Fatal Encounters Database v3.0

This is a database of everyone who died in encounters with police officers across Minnesota since the year 2000. The data are derived from death records and media reports and fed into a live Google Sheet.

[LIVE VERSION ON STATIC](https://static.startribune.com/news/projects/all/20220930-fataloisv3/build)

## History

This was initially developed for the project "A Cry For Help" but launched early in November 2015 immediately following the police-involved death of Jamar Clark in Minneapolis. That version was functional but held together by hope, tape and staples, and built mostly using D3, jQuery, HTML and CSS, with data fed from a Google Sheet so reporters could update the database in real time.

The next version was specifically crafted to run within the "A Cry For Help" package in 2016 and meticulously designed with that project's visual language, needed functionality and storytelling focus in mind, placing an emphasis not just on racial disparities associated with police-involved killings, but upon mental health crises among those who died. This version was also developed before any vital technological infracture was allotted to metro, so many of its resources lived outside the Star Tribune's ecosystem, leaving it vulnerable to the digital entropy that eventually claimed it.

Post-project, this was gradually redeveloped into a stand-alone, ongoing record of police-involved killings in Minnesota as a piece of public service journalism. We lacked easily-accessible special templates, and remained trapped within an iframe-centric world.

As the Star Tribune's technological prowess evolved throughout 2016-2017 and newsroom development began its maturation, it was necessary to keep this project running in response to changes in digital ecosystems. This involved patching the project and subjecting it to ongoing feature and design creep.

In 2018-2019, as the Star Tribune newsroom adopted modern development workflows, the project was ported to a [generator-striblab](https://github.com/striblab/generator-striblab) instance where it could breathe outside of iframes with the help of various backend solutions. While this modernized the project in significant ways, the core D3-powered code remained largely unchanged from 2015, so keeping it running and adding new features became increasingly challenging.

The years 2020-2021 were spent furiously patching frequent breakage that surfaced, especially following the Star Tribune's CMS upgrade to Chorus and the emergence of new backend solutions – while also attempting to address rising issues of editorial nuance – until our needs simply outgrew the archaic box crafted for this project.

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

* Shift data source from Google Sheets to Airtables
* Better, more intuitive UI design
* Allow for links to multiple related news stories for each profile
* Optimize design of profile cards into something sleeker with more insightful information
* Needs top-to-bottom restyling with digital designer input
* There are probably 36 quadrillion mobile design fixes to make, it should be stress-tested across devices
* Revisit and streamline how new entries are added, especially with localized photos
* ~~Styling interface elements onclick to signal current views~~
* ~~Filters and search work off jQuery instead of Svelte (I don't mind jQuery, but the developer world seems to have declared holy war against it)~~
* ~~Clicking the profile card expand button should scroll page to focus on the card~~
* ~~Map draws from a local GEOJSON file that has to be manually generated – perhaps automate in some way?~~


## Get started

Install the dependencies...

```bash
cd fatal-encounters
npm install
```

...then start vite:

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:5173). You should see your app running. Edit a component file in `src`, save it, and the page should reload with your changes.


## Deploying

Deployment is currently handled by a shell script (`strib-deploy.sh`) that has two dependencies:

[AWS CLI](https://aws.amazon.com/cli/) with properly configured credentials for the static.startribune.com bucket using the 'default' profile.

[jq](https://stedolan.github.io/jq/), which can be installed on a Mac via [Homebrew](https://brew.sh/):

```
brew install jq
```

To deploy to staging, run `npm run deploy-staging`. For production, run `npm run deploy-production`. This will upload to a typical path using your project's name, which is read from `package.json`. 