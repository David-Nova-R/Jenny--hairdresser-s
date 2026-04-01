# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier les .csproj et restore (optimise le cache Docker)
COPY Models/Models.csproj Models/
COPY Hairdressers-backend/Hairdressers-backend.csproj Hairdressers-backend/
RUN dotnet restore Hairdressers-backend/Hairdressers-backend.csproj

# Copier le reste du code et publier
COPY Models/ Models/
COPY Hairdressers-backend/ Hairdressers-backend/
RUN dotnet publish Hairdressers-backend/Hairdressers-backend.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Hairdressers-backend.dll"]
