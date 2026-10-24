# -------------------------------------------------
# 1️⃣ Choose a lightweight Node base image
# -------------------------------------------------
# node:20-alpine is small (~100 MB) and includes npm
FROM node:20-alpine AS base

# -------------------------------------------------
# 2️⃣ Set working directory inside the container
# -------------------------------------------------
WORKDIR /app

# -------------------------------------------------
# 3️⃣ Install production dependencies first
# -------------------------------------------------
# Copy only package.json & package-lock (if present) so Docker can cache this layer
COPY package*.json ./
# npm ci installs exact versions from lock file; --production skips dev deps
RUN npm ci --production

# -------------------------------------------------
# 4️⃣ Copy the rest of the application source
# -------------------------------------------------
COPY . .

# -------------------------------------------------
# 5️⃣ Expose the port your app listens on (5000)
# -------------------------------------------------
EXPOSE 5000

# -------------------------------------------------
# 6️⃣ Default command – start the server
# -------------------------------------------------
CMD ["node", "server.js"]
