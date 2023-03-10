# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node

# Set working directory. Paths will be relative this WORKDIR.
WORKDIR /app

# Install dependencies
ADD package*.json ./
# Copy source files from host computer to the container
ADD . .
RUN npm i --save-dev @types/node
RUN npm install typescript ts-node @prisma/client -g 
RUN npm install

# Run the app
CMD [ "npm", "start" ]