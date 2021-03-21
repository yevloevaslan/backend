FROM node:12.16.3-buster
WORKDIR /opt
ADD . /opt
RUN npm install
RUN npm install -g typescript
RUN tsc
EXPOSE 8887
CMD ["node", "./dist/adminService.js"]