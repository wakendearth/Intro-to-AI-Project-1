# Intro-to-AI-Project-1
Practice for use of Ai models in coding a website

This project will create a simple website that contains a homepage, about page, and card gallery. 
It will store multiple images of cards from Magic the Gathering that can be sorted.
The images are pulled from a JSON file that houses a vast amount of cards that can then be displayed in the gallery.


As this is a project using AI I will be using the read me as a log for planning. The script logs will be elsewhere in the project.
## Step 2: LLM choice:
I will be using Claude as my choice of LLM which has the capacity to also read my project files due to my subscription level.

## Step 3: Site Planning:
### 1. Page setup
Page 1, Home page: The first will be a home page welcoming the user to the site. It will link to the about page and the Card Gallery and give a brief overview of each.

Page 2, About page: The second page will explain the purpose of the page and explain its use of AI to create and possibly link to the repository for a more in-depth look.

Page 3, Card Gallery: The last page will be the card gallery and pull images of magic cards from a json file and display them in a 3x3 grid 
of images that can be navigated to other cards.

### 2. Design
The design will be a background of darker purples and black that wisp in a pleasing pattern. The text will be white displayed in Times New Roman.
The general layout will be a Title at the top, navigation bar at below the title of the 3 pages.
Content will be displayed in the middle which is dependent on the page and the footer will include my name, 
the date of creation,and a possible link to the json repository I will be using.

### 3. Plan
To create a website that will use the json file in the project to display cards from the Game: Magic the Gathering and be filterable by their color attribute. 
The website will have 3 pages: 

1. A home landing page that will have content briefly explaining the two other pages and have links to them in the content explaining them.

2. An about page that will explain the that the website used AI to create it and that the purpose of the website is to show a database of Magic the Gathering Cards
and allow them to be sorted through by its given color attribute.

3. A Card Gallery Page That will display a 3x3 grid of Magic the Gathering cards. It will display the first 9 entries in the json file and have a page selector to see the next or previous 9 cards in sequence. This will be accompanied by a color filter in the style of buttons of the 5 colors of White, Black, Red, Green, and Blue
that will look for cards with the exact match of colors selected and only display those entries.

Each page will be formatted with a black and purple wisp pattern as its background with white text using Times New Roman as its font. 
Each page will also have the title: "MTG Card Sorter" at the top left and a navigation bar to the three main pages underneath the title with the current page highlighted.

## Step 4. Main Page
Prompt used integrated with site plan:

Please create the HTML for the index.html file to make it into the home page for the MTG Card Gallery Website. The text should be in Times New Roman, the header should have the title of the website of "MTG Card Gallery" with a navigation bar underneath it. The navigation bar includes Home, About, and Gallery each with a link to their respective page. The contents of the page will have a welcoming text with two blocks underneath it that are horizontal to each other. The left talks about the about page and includes a link to that page at the bottom of its description. The right does the same for the Card Gallery. There will be a footer with the name of the Creator as "Chase Anderson" on the left, the middle giving a disclaimer about how this page was made with AI, and the right side of the footer will have the following link: https://mtgjson.com/downloads/all-files/

This prompt generated the response shown in PR 1 which was reviewed and merged into main it all compiles when tested in browser. It also made integrations based on another part of the plan not mentioned as it has access to this repository and was able to look at the plan I had set forward and integrated the CSS styling I had left out.


