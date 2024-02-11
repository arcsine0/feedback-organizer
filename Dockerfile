# Use an official Node runtime as a parent image
FROM node:19 AS client

# Set the working directory for the React app
WORKDIR /usr/src/client

# Copy the React app files
COPY client/package*.json ./
COPY client/ ./

# Install app dependencies
RUN npm install

# Expose the React app port
EXPOSE 3000

# Use an official Python runtime as another parent image
FROM python:3.10 AS server

# Set the working directory for the Python API
WORKDIR /usr/src/server

# Copy the Python API files
COPY server/requirements.txt ./
COPY server/ ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the Python API port
EXPOSE 8000

# Start both the React app and Python API
CMD ["sh", "-c", "npm start & uvicorn api:app --host 0.0.0.0 --port 8000 --reload"]
