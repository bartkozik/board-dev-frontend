FROM node:20.13.0 AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:1.21.0 as production
ARG BUILD_VERSION
ENV APP_VERSION=$BUILD_VERSION
ENV NODE_ENV production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.template
COPY entrypoint.sh entrypoint.sh
EXPOSE 80
CMD ["/bin/sh",  "/entrypoint.sh"]
