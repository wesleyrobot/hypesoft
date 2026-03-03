FROM mcr.microsoft.com/playwright:v1.49.0-jammy

WORKDIR /e2e

COPY package.json ./
RUN npm install
RUN npx playwright install chromium

COPY . .

CMD ["npx", "playwright", "test", "--reporter=list"]
