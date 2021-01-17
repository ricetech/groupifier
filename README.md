# groupifier
Live website link: [https://groupifier.space](https://groupifier.space)

## Inspiration
Throughout our time in school, we've been placed in many group projects. For many of those, our groups were randomly generated, many times resulting in us getting stuck in a group with people that we didn't get along with.

## What it does

Groupifier aims to change that. It's an easy-to-use webapp that firstly allows the host of an event (or a classroom teacher) to paste in a list of names and emails. Then, Groupifier asks each person to submit their preferences through an email link that redirects them to a custom form where they can select who they would prefer and who they would prefer not to be in a group with. Finally, Groupifier runs a special algorithm on that collected data to create groups that aim to satisfy as many people as possible.

## How we built it

The frontend that Groupifier runs on is built on React TypeScript for type safety with a custom theme overlaid on top of React Bootstrap. React Router is used for navigation, while React Select is used to get the combo select boxes utilized in the group building screen.

The backend is also coded in TypeScript but is heavily centred around Firebase Cloud Functions, a 'backend-as-a-service' tool to save time that would otherwise be spent trying to set up a backend server in 36 hours. Firebase Authentication is used to secure the app, while CockroachDB (a SQL-based database) is used to store the data needed for the algorithm to run. Finally, NodeMailer is used to send invite links and results to each participant in a timely and consistent manner.

## Challenges we ran into
By far the hardest problem that we had to solve was creating the algorithm that was used to create the groups. We did a lot of research on potential methods and concepts that could be useful in creating an algorithm - both those that we learned in class as well as ones that we discovered online.

We quickly established that the best way to represent the problem was to use graph theory, using nodes and weighted edges to represent the preferences that people had for each other. We explored some computer science concepts such as minimum spanning trees (MSTs) and the Stable Matching Problem, but in the end, we had to develop a new algorithm from scratch as we were unable to find any solutions to this problem while doing our research. It's important to note that while solutions exist for the Stable Matching Problem, they do not seem to exist for the same problem with group sizes of greater than three involved - likely due to the rapidly increasing time complexity of these solutions.

We also ran into external technical difficulties during the development process when CockroachDB suffered an outage. We were able to adapt by preparing another PostgreSQL database hosted elsewhere, but CockroachDB was able to partially recover from the outage and we were able to move back to it in good time.

## Accomplishments that we're proud of
We're very proud of the algorithm that we created since our solution was acceptable for use in the app given the extremely short timeframe that we developed it in. We're also pleased with the algorithm since we developed it ourselves - none of the code (or even the major ideas) was taken from external sources.

## What we learned
Throughout the course of Hack the North, we gained many new skills. Firstly were SQL (specifically, PostgreSQL) databases which was new to all but one of us but proved to be a very logical way to store and manipulate data. Secondly, for some of our group members, this was our first time working extensively with using Firebase Cloud Functions, Authentication and Hosting, all of which were very powerful tools that made creating a secure yet fast webapp much easier. Additionally, through using Figma, we were able to better learn and apply various concepts of UI/UX Design. Finally, for most of us, this was our first time working with React TS, React Router and React Select, which proved to be an entirely different and yet very interesting way to build a webapp.

## What's next for groupifier
Even while still developing Groupifier, we've already been thinking of a lot of different ways that we could improve the app in the future. 

For starters, we have already been considering several improvements to the algorithm to increase the quality of the groups produced. We would also like to consider other languages to code the backend in such as Java or Go - TypeScript was only chosen out of familiarity and convenience through its compatibility with Firebase Cloud Functions. Additionally, we are considering making the theme more consistent throughout the website through the use of SASS files, as it is currently applied per-component for the most part. The user experience is also something that our group would like to work on to increase the fluidity and ease of use for customers. Finally, we would like to contact potential customers of our app to discuss features that they might want to see in our app.
