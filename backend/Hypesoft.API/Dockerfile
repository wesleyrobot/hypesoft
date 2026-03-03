FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["Hypesoft.API/Hypesoft.API.csproj", "Hypesoft.API/"]
COPY ["Hypesoft.Application/Hypesoft.Application.csproj", "Hypesoft.Application/"]
COPY ["Hypesoft.Domain/Hypesoft.Domain.csproj", "Hypesoft.Domain/"]
COPY ["Hypesoft.Infrastructure/Hypesoft.Infrastructure.csproj", "Hypesoft.Infrastructure/"]
RUN dotnet restore "Hypesoft.API/Hypesoft.API.csproj"
COPY . .
WORKDIR "/src/Hypesoft.API"
RUN dotnet build "Hypesoft.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Hypesoft.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]
