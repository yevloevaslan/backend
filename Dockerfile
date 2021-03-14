FROM node:12.16.3-buster
WORKDIR /opt
ADD . /opt
RUN npm install
RUN npm install -g typescript
RUN tsc
EXPOSE 8888
CMD ["node", "./dist/index.js"]