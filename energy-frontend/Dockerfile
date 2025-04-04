# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]
