FROM node:18-alpine

WORKDIR /myfolder/
COPY ./package.json /myfolder/
COPY ./package-lock.json /myfolder/
RUN npm install

COPY . /myfolder/
CMD npm run start:dev
