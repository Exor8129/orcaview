# Step 1: Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Step 4: Install application dependencies inside the container
RUN npm install

# Step 5: Copy the rest of the project files into the container
COPY . .

# Step 6: Build the Next.js application for production
RUN npm run build

# Step 7: Expose port 3000 to allow external access
EXPOSE 3000

# Step 8: Start the Next.js application in production mode
CMD ["npm", "start"]
