FROM node:17-alpine As development

# setting the image working directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json to the image working directory
COPY package*.json ./

# install development dependencies
# RUN npm install --only=development
RUN npm install --only=development --force

# copy the application code to the working directory of image
COPY . .

EXPOSE 3000
#  build the application
RUN npm run build



FROM node:17-alpine As production

# defining a variable, NODE_ENV
ARG NODE_ENV=production

# setting node environment variable to production
ENV NODE_ENV=${NODE_ENV}

ARG MONGO_DATABASE_URI=mongodb://mongo:mongo@car_mongodb
ARG RDS_HOSTNAME=localhost
ARG RDS_PORT=5432
ARG RDS_DB_NAME=Database
ARG RDS_USERNAME=SkyData
ARG RDS_PASSWORD=SkyData

ENV MONGO_DATABASE_URI="${MONGO_DATABASE_URI}"

ENV RDS_HOSTNAME="${RDS_HOSTNAME}" \
    RDS_PORT="${RDS_PORT}" \ 
    RDS_DB_NAME="${RDS_DB_NAME}" \
    RDS_USERNAME="${RDS_USERNAME}" \
    RDS_PASSWORD="${RDS_PASSWORD}"


# setting the working directory of image
WORKDIR /usr/src/app

# copy package.json and package-lock.json to the image working directory
COPY package*.json ./

#  so that Typescript isn't installed in the production image
RUN npm install --only=production --force

COPY . .

#  copy the compiled javascript code to out production image
COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

# run the application
CMD ["node", "dist/main"]