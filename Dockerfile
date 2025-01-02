# Use official Node.js image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Install the latest version of npm
RUN npm install -g npm@latest

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including build tools for sqlite3
RUN npm install

# Copy the rest of the application files
COPY . .

# Rebuild sqlite3 to ensure compatibility
RUN npm rebuild sqlite3

# Expose the port that your app is running on (e.g., 3000)
EXPOSE 3000

# Command to run the app
CMD ["node", "app.js"]