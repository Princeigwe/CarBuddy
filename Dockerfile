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

# setting the working directory of image
WORKDIR /usr/src/app

# copy package.json and package-lock.json to the image working directory
COPY package*.json ./

#  so that Typescript isn't installed in the production image
RUN npm install --only=production --force

COPY . .

ARG MONGO_DATABASE_URI
ARG RDS_HOSTNAME
ARG RDS_PORT
ARG RDS_DB_NAME
ARG RDS_USERNAME
ARG RDS_PASSWORD
ARG JWT_SECRET
ARG GMAIL_USER
ARG GMAIL_PASSWORD
ARG OAUTH_CLIENT_ID
ARG OAUTH_CLIENT_SECRET
ARG OAUTH_REFRESH_TOKEN
ARG SESSION_SECRET

ENV MONGO_DATABASE_URI="${MONGO_DATABASE_URI}"

ENV RDS_HOSTNAME=$RDS_HOSTNAME 
ENV RDS_PORT=$RDS_PORT 
ENV RDS_DB_NAME=$RDS_DB_NAME 
ENV RDS_USERNAME=$RDS_USERNAME 
ENV RDS_PASSWORD=$RDS_PASSWORD
ENV JWT_SECRET=$JWT_SECRET
ENV GMAIL_USER=$GMAIL_USER
ENV GMAIL_PASSWORD=$GMAIL_PASSWORD
ENV OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID
ENV OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET
ENV OAUTH_REFRESH_TOKEN=$OAUTH_REFRESH_TOKEN
ENV SESSION_SECRET=$SESSION_SECRET

#  copy the compiled javascript code to out production image
COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000
# run the application
CMD ["node", "dist/main"]