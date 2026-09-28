FROM node:20.18.0

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY next.config.js ./

RUN npm install

CMD ["npm", "run", "dev"]
