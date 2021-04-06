FROM node:alpine

WORKDIR /usr/src/app

COPY . .
RUN npm install

EXPOSE 9000
CMD ["npm", "run", "start" ]
