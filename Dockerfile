FROM node:14
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY package-lock.json ./
COPY ./src ./src
COPY ./test ./test
RUN npm install --loglevel=error
RUN npm run build
RUN npm install pm2 -g --loglevel=error
EXPOSE 8000
CMD ["pm2-runtime","./dist/main.js"]