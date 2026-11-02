FROM node:20.13.0 AS builder
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install
# Copy app files
COPY . .
# Build the app
RUN yarn build

# Bundle static assets with nginx
FROM nginx:1.21.0 as production
ARG BUILD_VERSION
ENV APP_VERSION=$BUILD_VERSION
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.template
COPY entrypoint.sh entrypoint.sh
# Expose port
EXPOSE 80
# Start nginx
CMD ["/bin/sh",  "/entrypoint.sh"]
