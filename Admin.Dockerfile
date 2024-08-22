# Use a node base image
FROM node:18 AS base

# Set the working directory
WORKDIR /

# Copy only the necessary files for installing dependencies
COPY package.json yarn.lock ./
COPY turbo.json ./


# Install dependencies
RUN yarn global add turbo 

COPY apps/ apps/
COPY packages/ packages/
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the specific app
RUN turbo run build --filter=admin

WORKDIR /apps/admin

EXPOSE 3000

CMD ["vite", "--host", "0.0.0.0", "--port", "3000"]
