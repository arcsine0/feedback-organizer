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
The server side, specifically the REST api is handled with **FastAPI Python**. To set the api up, head to the **server** directory, under **model**, do
> `pip install requirements.txt`

Once all the packages are installed, do a 
> `uvicorn api:app --reload`
to run the api server.
