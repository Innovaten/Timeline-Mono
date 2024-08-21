# Use a node base image
FROM node:18 AS base

# Set the working directory
WORKDIR /app

# Copy only the necessary files for installing dependencies
COPY package.json yarn.lock ./
COPY turbo.json ./

COPY apps/ apps/
COPY packages/ packages/

# Install dependencies
RUN yarn global add turbo && yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the specific app
RUN turbo run build --filter=core

# Set the working directory to the app's build output
WORKDIR /app/core/dist

# Start the app
CMD ["node", "main.js"]

# Expose the port the app runs on
EXPOSE 4000