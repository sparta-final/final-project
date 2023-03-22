FROM node:18-alpine

WORKDIR /myfolder/
COPY ./package.json /myfolder/
COPY ./package-lock.json /myfolder/
RUN npm install
RUN npm run build

COPY . /myfolder/
CMD npm run start:prod
