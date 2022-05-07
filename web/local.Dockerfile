FROM node:latest
WORKDIR /app
COPY . ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
ENV PATH /app/node_modules/.bin:$PATH
CMD ["npm", "start"]