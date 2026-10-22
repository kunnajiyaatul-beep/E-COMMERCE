# Ecom Security (corrected)

This is the `ecoSecurity` authentication service for the React + SpringEcom project.

## Local services
- React frontend: `http://localhost:5175`
- ecoSecurity auth service: `http://localhost:8080`
- SpringEcom API: `http://localhost:8081`

## Required environment variables

Set these before running the service. Keep real credentials out of source control.

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/userLoginDb"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
$env:GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
$env:GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
$env:GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"
$env:GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET"
$env:JWT_SECRET="YOUR_SHARED_BASE64_JWT_SECRET"
$env:JWT_EXPIRATION="3600000"
```

`JWT_SECRET` must be the exact same Base64-encoded value in `ecoSecurity` and `SpringEcom`.
Generate a strong key once (for example, using Java's `KeyGenerator` for HmacSHA256 and Base64-encoding its bytes), then configure the same value in both applications. Do not generate a new key at every startup.

## Run on Windows

From this folder (`ecoSecurity`):

```powershell
.\mvnw.cmd clean spring-boot:run
```

## API
- `POST /register` with JSON: `{"username":"user@example.com","password":"your-password"}`
- `POST /login` with JSON: `{"username":"user@example.com","password":"your-password"}`; response contains `token` and `tokenType`.
- OAuth2 entry points: `/oauth2/authorization/google` and `/oauth2/authorization/github`
- OAuth2 success redirects to `http://localhost:5175/oauth-success?token=...`

## Important
1. The React login handler must store `response.data.token` because `/login` returns a JSON object now.
2. After changing `JWT_SECRET`, sign in again and replace the old token in browser storage.
3. Rotate the database, Google OAuth, and GitHub OAuth credentials that were present in the originally uploaded ZIP. They should be treated as exposed.
4. OAuth provider redirect URLs should include `http://localhost:8080/login/oauth2/code/google` and `http://localhost:8080/login/oauth2/code/github`.
