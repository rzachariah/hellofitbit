FROM node:argon

ENV PORT 80
EXPOSE $PORT
WORKDIR /app
ADD package.json /app/
RUN npm install
COPY . /app

ENTRYPOINT [ "node", "server.js" ]