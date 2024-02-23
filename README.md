# Welcome to my **Feedback Organizer**
This project is a feedback organizer integrated with Emotion-detection and Zero-class classification models.

# Setup
After cloning this project, you will be presented with 2 directories representing the entire stack.

# Client 
The client side is handled by **React**, to set this up, head to the **client** directory and do:
> `npm install`

Once all the dependencies are installed, do a
> `npm start`

to run the React front-end.

# Server
The server code has been migrated to Express JS, to set this up, head to the  `server/js` directory and do:
> `npm install`

Once all the dependencies are installed, do a
> `nodemon start`

to run the Express back-end.

# Testing
Until I implement the sorting logic, you can test the models in the **Playground**. Just select it on the sidebar or navigate to `/playground`.
Make sure that the api is up and running before doing this though.

# Planned features
So the way I'm thinking this could work is that the user could define a **Source** (i.e, directly on the app, from google forms, etc...) and then we just process the feedbacks and display it on the app. 
Then the sorting can be configured by the user depending on the predicted emotion, tag, date, or based on **Importance**. The **Importance** sorting would be a combination of emotion + topic depending on the use case also selected by the user, which we are to define ourselves.

Tags will also have **Sub-tags** to further categorize the feedbacks. This could serve as the actual main topic of the feedbacks. For example, a feedback categorized as a `Bug Report` could be further specified to either `UI/UX` or `Loading Time`.

