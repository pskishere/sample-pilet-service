FROM node:alpine

WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN npm run build

EXPOSE 9000
CMD ["npm", "run", "start" ]
