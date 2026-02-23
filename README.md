# Banking API - Retrofit + Coroutines Integration

A production-ready banking API built with Node.js, Express, and TypeScript. Designed for Android learners integrating with Retrofit and Coroutines. Ready to deploy on Vercel.

## Features

- ✅ **TypeScript** - Strict type safety
- ✅ **Express.js** - Lightweight web framework
- ✅ **JWT Authentication** - HMAC-based token security
- ✅ **In-Memory Store** - No external database required
- ✅ **OpenAPI/Swagger** - Full API documentation at `/docs`
- ✅ **Comprehensive Tests** - Jest + Supertest coverage
- ✅ **Postman + Thunder Collections** - Ready-to-use API clients
- ✅ **Vercel Deployment Ready** - One-click deployment
- ✅ **CORS Enabled** - Cross-origin support for Android/Web clients
- ✅ **Error Handling** - Standardized error responses
- ✅ **Pagination** - Cursor-based transaction pagination

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your JWT secret (minimum 32 characters):

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secure-secret-key-minimum-32-characters
CORS_ORIGIN=http://localhost:3000,http://10.0.2.2:3000
```

### 3. Run Development Server

```bash
npm run dev
```

The server starts at:
- **Development**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **API Docs**: `http://localhost:3000/docs`

### 4. Build & Run in Production

```bash
npm run build
npm start
```

## Testing

Run the full test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## Code Quality

Format code:

```bash
npm run format
```

Lint code:

```bash
npm run lint
npm run lint:fix
```

Type checking:

```bash
npm run type-check
```

## Seed Data

The API automatically seeds test data on startup:

- **Email**: `alex@example.com`
- **Password**: `password`
- **Accounts**: 2 (Checking: $2,360.42, Savings: $12,450)
- **Transactions**: 17 sample transactions

## API Documentation

### Base URLs

| Environment | URL |
| --- | --- |
| Local Development | `http://localhost:3000` |
| Android Emulator | `http://10.0.2.2:3000` |
| Production (Vercel) | `https://your-deployment.vercel.app` |

### Authentication

All endpoints (except `/auth/*`) require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens expire after 7 days.

### Endpoints

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

#### User

- `GET /me` - Get current user profile

#### Accounts

- `GET /accounts` - List all user accounts
- `GET /accounts/:id` - Get account details

#### Transactions

- `GET /accounts/:id/transactions?limit=20&cursor=<id>` - Paginated transactions

#### Transfers

- `POST /transfers` - Create a transfer between accounts

### Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

**Error Codes:**

- `INVALID_INPUT` (400) - Validation failed
- `UNAUTHENTICATED` (401) - Missing or invalid token
- `FORBIDDEN` (403) - Access denied
- `NOT_FOUND` (404) - Resource not found
- `INSUFFICIENT_FUNDS` (409) - Transfer amount exceeds balance
- `INTERNAL_ERROR` (500) - Server error

## Curl Examples

### Login

```bash
curl -X POST http://10.0.2.2:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@example.com",
    "password": "password"
  }'
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "ab1234cd5678ef",
    "name": "Alex Demo",
    "email": "alex@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Accounts

```bash
curl -X GET http://10.0.2.2:3000/accounts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Create Transfer

```bash
curl -X POST http://10.0.2.2:3000/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Idempotency-Key: transfer-2024-02-23-12345" \
  -d '{
    "fromAccountId": "c1234567890ab",
    "toAccountId": "c0987654321cd",
    "amount": 150.50,
    "note": "Payment for lunch"
  }'
```

## Postman & Thunder

### Import Collections

**Postman:**

1. Open Postman
2. Click `File` → `Import`
3. Select [postman_collection.json](./postman_collection.json)
4. Set variables in the collection:
   - `BASE_URL`: `http://localhost:3000` or `http://10.0.2.2:3000`

**Thunder Client:**

1. Open Thunder Client in VS Code
2. Click `Collections` → `Import`
3. Select [thunder_collection.json](./thunder_collection.json)
4. Update variables in the collection settings

### Workflow

1. Call **Login** endpoint
   - Token is automatically saved to `{{token}}` variable
   - Account IDs are saved to variables after calling "Get All Accounts"
2. Use other endpoints with auto-populated variables
3. Postman/Thunder handles token injection automatically

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Vercel auto-detects Node.js project

### 3. Set Environment Variables

In Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add:
   - `JWT_SECRET` (minimum 32 characters)
   - `CORS_ORIGIN` (e.g., `http://localhost:3000,http://10.0.2.2:3000`)
   - `NODE_ENV`: `production`

### 4. Deploy

Click "Deploy" - Vercel will automatically build and deploy your API.

**Your API will be at:** `https://your-project-name.vercel.app`

### Update Android Base URL

In your Android app (Retrofit), use the production URL:

```kotlin
val retrofitClient = Retrofit.Builder()
    .baseUrl("https://your-project-name.vercel.app")
    .addConverterFactory(GsonConverterFactory.create())
    .build()
```

## Project Structure

```
banking-api/
├── src/
│   ├── app.ts              # Express app setup
│   ├── index.ts            # Server entry point
│   ├── routes/             # API route handlers
│   │   ├── auth.ts
│   │   ├── me.ts
│   │   ├── accounts.ts
│   │   ├── transactions.ts
│   │   └── transfers.ts
│   ├── services/           # Business logic
│   │   ├── authService.ts
│   │   ├── accountService.ts
│   │   ├── transactionService.ts
│   │   ├── transferService.ts
│   │   └── seedService.ts
│   ├── middleware/         # Express middleware
│   │   ├── authGuard.ts
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── models/             # Data models & store
│   │   ├── types.ts
│   │   └── store.ts
│   ├── utils/              # Utilities
│   │   ├── id.ts
│   │   ├── money.ts
│   │   └── paging.ts
│   └── docs/
│       └── openapi.yaml    # API documentation
├── test/                   # Test files
│   ├── auth.test.ts
│   ├── accounts.test.ts
│   ├── transactions.test.ts
│   └── transfers.test.ts
├── package.json
├── tsconfig.json
├── jest.config.js
├── vercel.json             # Vercel configuration
├── postman_collection.json # Postman collection
└── thunder_collection.json # Thunder Client collection
```

## Key Design Patterns

### Skinny Routes, Fat Services

Routes delegate business logic to services:

```typescript
// routes/accounts.ts
router.get('/:id', (req, res, next) => {
  try {
    const account = accountService.verifyAccountOwnership(id, userId);
    res.json(account);
  } catch (err) {
    next(err);
  }
});
```

### Centralized Error Handling

All errors are caught and normalized:

```typescript
// middleware/errorHandler.ts
if (err.code && err.message && err.statusCode) {
  res.status(err.statusCode).json({
    error: { code: err.code, message: err.message }
  });
}
```

### Type Safety

Strict TypeScript configuration prevents runtime errors:

```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
```

### Pagination

Cursor-based pagination for stable ordering:

```typescript
GET /accounts/:id/transactions?limit=20&cursor=t1234567890ab
```

## Learning Resources for Android Developers

### Retrofit Integration

```kotlin
// Define service interface
interface BankingService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @GET("accounts")
    suspend fun getAccounts(
        @Header("Authorization") token: String
    ): AccountsResponse

    @POST("transfers")
    suspend fun createTransfer(
        @Header("Authorization") token: String,
        @Header("Idempotency-Key") idempotencyKey: String,
        @Body request: TransferRequest
    ): TransferResponse
}
```

### Coroutines Integration

```kotlin
viewModelScope.launch {
    try {
        val response = bankingService.login(loginRequest)
        saveToken(response.token)
        emit(Success(response.user))
    } catch (e: Exception) {
        emit(Error(e.message))
    }
}
```

## Production Checklist

- [ ] Set strong `JWT_SECRET` (minimum 32 characters)
- [ ] Enable CORS for your mobile app domain
- [ ] Set `NODE_ENV=production` in Vercel
- [ ] Review error messages for security (no stack traces)
- [ ] Set up database for persistent data (future enhancement)
- [ ] Implement rate limiting (future enhancement)
- [ ] Add request logging and monitoring (future enhancement)
- [ ] Set up backup strategy (future enhancement)

## Troubleshooting

### CORS Errors on Android

Edit `.env`:

```
CORS_ORIGIN=http://10.0.2.2:3000,http://localhost:3000,https://your-domain.com
```

### Token Expired

Tokens expire after 7 days. User must login again.

### Insufficient Funds Error

Check account balance before creating transfer. Transfer amount must not exceed balance.

### Idempotency

Pass `Idempotency-Key` header for safe retries:

```
Idempotency-Key: transfer-2024-02-23-12345
```

Same key + parameters = same result (safe to retry).

## Contributing

This is a learning project. Feel free to extend with:

- Database integration (MongoDB, PostgreSQL)
- Rate limiting middleware
- Request logging
- OpenAPI 3.1 enhancements
- Additional validations
- Transaction constraints

## License

MIT

## Support

For Android integration questions, refer to [Retrofit documentation](https://square.github.io/retrofit/) and [Kotlin Coroutines guide](https://kotlinlang.org/docs/coroutines-overview.html).
