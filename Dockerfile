FROM ubuntu:focal

# Update and install dependencies
RUN /usr/bin/apt-get update && \
    /usr/bin/apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | /bin/bash - && \
    /usr/bin/apt-get update && \
    /usr/bin/apt-get upgrade -y && \
    /usr/bin/apt-get install -y nodejs ffmpeg

# Set the working directory
WORKDIR /home/app

# Install nodemon globally
RUN npm install -g nodemon
RUN npm install -g yarn

CMD ["nodemon", "server.js"]