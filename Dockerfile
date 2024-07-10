# Use the official Node.js image
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code.
COPY . .

# Expose port 8080 and define the command to run the app
EXPOSE 8080
CMD [ "npm", "start" ]
