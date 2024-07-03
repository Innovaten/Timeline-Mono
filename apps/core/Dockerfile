# Stage 1: Build
FROM node:18 AS builder

# Set the working directory
WORKDIR /app


# Copy the root package.json and yarn.lock
COPY package.json ../../yarn.lock ./

# Copy workspace configurations
COPY turbo.json ./

RUN npm install -g yarn

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy workspace packages
COPY src/ ./src/

# Build the application
RUN yarn build

# Stage 2: Production
FROM node:18 AS runner


# Copy the built application from the build stage
COPY --from=builder /app/dist ./dist

# Copy package.json and yarn.lock to install production dependencies
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Expose the port the app runs on
EXPOSE 4000

# Set environment variables if any (example)
ENV NODE_ENV production

# Command to run the application
CMD ["yarn", "start"]