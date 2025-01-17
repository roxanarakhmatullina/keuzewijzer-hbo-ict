FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app

# Define build arguments
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG EMAIL_FROM
ARG EMAIL_PASS
ARG EMAIL_PORT
ARG EMAIL_SMTP_SERVER
ARG EMAIL_USR
ARG JWT_AUDIENCE
ARG JWT_ISSUER
ARG JWT_SECRET

# Construct the connection string from build arguments
ARG CONNECTION_STRING
RUN export CONNECTION_STRING="Host=${DB_HOST};Port=${DB_PORT};Username=${DB_USER};Password=${DB_PASSWORD};Database=${DB_NAME}"

# Use the build arguments to set environment variables in the container
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV EMAIL_FROM=${EMAIL_FROM}
ENV EMAIL_PASS=${EMAIL_PASS}
ENV EMAIL_PORT=${EMAIL_PORT}
ENV EMAIL_SMTP_SERVER=${EMAIL_SMTP_SERVER}
ENV EMAIL_USR=${EMAIL_USR}
ENV JWT_AUDIENCE=${JWT_AUDIENCE}
ENV JWT_ISSUER=${JWT_ISSUER}
ENV JWT_SECRET=${JWT_SECRET}

# Now the connection string will also be an environment variable
ENV CONNECTION_STRING=${CONNECTION_STRING}

EXPOSE 5125

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Server/Server.csproj", "Server/"]
RUN dotnet restore "Server/Server.csproj"
COPY . .
WORKDIR "/src/Server"
RUN dotnet build "Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Server.dll"]
