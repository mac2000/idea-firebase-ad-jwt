FROM microsoft/nanoserver
MAINTAINER Alexandr Marchenko <marchenko.alexandr@gmail.com>

ENV NODE_VERSION 7.10.0

RUN powershell -Command "Invoke-WebRequest https://nodejs.org/dist/v$($env:NODE_VERSION)/node-v$($env:NODE_VERSION)-win-x64.zip -OutFile /node.zip -UseBasicParsing; Expand-Archive /node.zip /; Rename-Item /node-v$($env:NODE_VERSION)-win-x64 node; Remove-Item /node.zip"
RUN SETX PATH C:\node

RUN mkdir \app
WORKDIR /app

COPY package.json package.json
RUN npm install
COPY . .

EXPOSE 3000

CMD ["/node/npm.cmd", "start"]
