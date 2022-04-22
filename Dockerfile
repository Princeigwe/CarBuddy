FROM node:17-alpine As development

# setting the image working directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json to the image working directory
COPY package*.json ./

# install development dependencies
RUN npm install --only=development

# copy the application code to the working directory of image
COPY . .

#  build the application
RUN npm run build



FROM node:17-alpine As production

# defining a variable, NODE_ENV
ARG NODE_ENV=production

# setting node environment variable to production
ENV NODE_ENV=${NODE_ENV}

# setting the working directory of image
WORKDIR /usr/src/app

# copy package.json and package-lock.json to the image working directory
COPY package*.json ./

#  so that Typescript isn't installed in the production image
RUN npm install --only=production

COPY . .

#  copy the compiled javascript code to out production image
COPY --from=development /usr/src/app/dist ./dist

# run the application
CMD ["node", "dist/main"]