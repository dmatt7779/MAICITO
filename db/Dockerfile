FROM mysql:8.0

# Copy initialization script — MySQL auto-executes files in
# /docker-entrypoint-initdb.d/ on first container start only
COPY sql-ubi-12_24.sql /docker-entrypoint-initdb.d/01-init.sql

# Default charset
ENV MYSQL_CHARACTER_SET_SERVER=utf8mb4
ENV MYSQL_COLLATION_SERVER=utf8mb4_general_ci

EXPOSE 3306
