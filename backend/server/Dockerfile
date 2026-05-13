# 1. Use a lightweight version of Node.js
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json first (this caches dependencies to make builds faster)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your backend code
COPY . .

# 6. Expose the port your Express server runs on
EXPOSE 5000

# 7. Command to start the server
CMD ["node", "server.js"]