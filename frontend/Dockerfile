FROM node:16
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
EXPOSE 3000
CMD ["npm", "start"]
