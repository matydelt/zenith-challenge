
FROM node:18@sha256:c5c88762e9097e7fa405e5713731ea924fa52da33a13929ed64d8a6b79b95c89
COPY --chown=node:node . .
RUN npm ci
RUN npm run build
USER node
CMD [ "node", "dist/main.js"]