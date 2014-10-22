Epic Work View for Jira
============

Epic Work View for JIRA is a plugin to be used with JIRA Agile which displays in-flight work on projects. With the addition of Epic Work View for JIRA, users can quickly see progress on projects in JIRA. Live updates show beginning and completed work in an organized table. 
## Documentation
### Project Rows
Project rows display information about a Jira project. The first section, starting from the left, shows the project name with the icon and project group. Projects can be clicked on to open the project in Jira. Below that is the last updated time of the project. The next section displays the number of stories completed in the project within the current time frame. The last section shows contributors and epics in the project. The contributor list is sorted by last update time, so the first contributor in the list will be the most recent contributor to the project. Any contributors who have not worked on the project in the current time frame will not be shown. Clicking on a contributor will open that user's page in Jira. The epics are also sorted by last update time. Some projects may contain an epic labeled "Other Stories". This epic is created to hold stories that are not assigned an epic. Each epic's color reflects the color assigned to it in Jira. Clicking on an epic will open up a list of stories for that epic as well as an info button. The info button is a link to our [Detailed Epic View](https://github.com/cobaltdev/epicworkview#detailed-epic-view). Incomplete stories appear on the left side of the screen while completed ones are on the right. Stories also include a header which shows the contributor for that story, the last update time, an info button that opens the story in Jira, and a checkmark to indicate completion. 

### Live Update
Everything on the page updates live when changes occur. The project rows, as well as contributor lists and epic lists, are sorted by last update time. For a project to be updated, work must have either been started or completed on a story or subtask in that project. Transitions from one in progress state to another or other changes, such as name changes, will not count as an update. On project updates, the row will animate to the top of the page. The animation is simplified on a large move to reduce lag time. To eliminate this simplification, use the [Project Filter](https://github.com/cobaltdev/epicworkview#project-filter) to view a smaller subset of projects on your screen. 

### Project Filter
The project filter is located on the left side of the screen in an icon resembling a magnifying glass. Projects can be removed from view by unchecking the project in the filter. To search for a specific project, type into the search box and the list will automatically update. You can search by project name or project group. Initial typing in the search box will clear all projects. This makes it easy to view only a subset of projects. Simply type into the search box, find the projects you want to see, and select them. Filter preferences are saved on a user's computer. Closing the page and opening it again will return a user to the same filter options. To share the filter with someone else, you can copy the url, which updates automatically on filtering. 

### Fullscreen Mode
To go into fullscreen mode, click on the fullscreen button in the navigation bar on the left side of the screen. In fullscreen mode, the Jira header and footer disappear, all links will open in a modal, and any open windows or drop downs will close after a period of inactivity. 

### Detailed Epic View
The detailed epic view can be accessed by clicking the info button above an active epic. The detailed view shows a list of all stories in the epic, a progress bar and chart displaying story creation and completion. The page can be toggled between stories, story points or work hours. The drop down menu in the upper right corner switches to different epics in the project. In the chart, there are four different lines. The In Flight line tracks how many stories are in flight (created and not resolved) at any time. The Created and Resolved lines display how many stories were created and resolved during a period of time. Hover over those lines to see more specific information. The Forecast line shows a forecasted completion date assuming that no more stories are created, based on the number of stories completed within the last seven days. To zoom, highlight a vertical section on the chart or the overall view below it. The progress bar and story list will also update to this new time range. 

### Aggregate Header
The top bar on the page displays totals for all visible projects. If you do not want to see this header, close it by clicking the 'x' in the upper right corner. To bring the header back, hover over the top of the page and a button will appear. 

## Compatability
Epic Work View for JIRA is compatible with JIRA 6.1 and up and with JIRA Agile 6.3.6.1 and up. JIRA Agile is required for the plugin to function in a useful manner. 

## Installation and License
The Epic Work View for JIRA  application can be easily installed via UPM. Licenses can be freely obtained at the Atlassian Marketplace.
 
For more detailed installation instructions: 
https://github.com/cobaltdev/epicworkview/wiki/Installation-&-License

For development instructions: 
https://github.com/cobaltdev/epicworkview/wiki/Development-Instructions
