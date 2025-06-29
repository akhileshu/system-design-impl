FROM node:18-alpine

# Set working directory
WORKDIR /home/node/app

# Copy package files as root
COPY package*.json ./

# Install deps as root
RUN npm install

# Copy source code with proper ownership
COPY --chown=node:node . .

# Change to non-root user
USER node

EXPOSE 3000

CMD ["npx", "ts-node-dev", "--respawn", "src/cluster.ts"]


# sudo docker build -t  akhilesh/scalability-and-performance .
# sudo docker images
# sudo docker run --name nodejs-image-scalability-and-performance -p 30:3000 -d akhilesh/scalability-and-performance
# docker stop nodejs-image-scalability-and-performance
