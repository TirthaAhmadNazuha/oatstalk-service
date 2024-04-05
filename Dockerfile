FROM jitesoft/node-base

COPY ./ /app

WORKDIR /app

RUN npm i

CMD npm start
