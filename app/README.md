# MyBank 360 Frontend

Modern Next.js frontend for the MyBank 360 personal finance management platform.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hook Form + Zod** - Form validation

## Features

### 🔐 Authentication
- User registration with validation
- Login with JWT tokens
- Automatic token refresh
- Secure session management

### 📊 Dashboard
- Asset summary overview
- Category breakdown with charts
- Total balance display
- Asset list with details

### 💰 Spending Analysis
- Category-based spending breakdown
- Customizable time periods (7/30/90 days)
- Interactive charts
- Anomalous transaction detection

### 📈 Investment
- Investment portfolio summary
- Round-up investment tracking
- Investment history
- Automated investment insights

### 💳 Payment & Transfer
- Secure account transfers
- Real-time transaction status
- Transaction history
- Integration with round-up investment

## Project Structure

```
app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   │   ├── spending/
│   │   │   ├── investment/
│   │   │   └── payment/
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/              # Reusable components
│   ├── ui/                 # UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── layout/             # Layout components
│       └── Sidebar.tsx
├── lib/                    # Core libraries
│   ├── api/               # API client & endpoints
│   │   ├── client.ts
│   │   └── endpoints.ts
│   └── utils/             # Utility functions
│       ├── cn.ts
│       └── format.ts
├── stores/                # Zustand stores
│   └── authStore.ts
├── types/                 # TypeScript types
│   └── api.ts
└── package.json
```

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at http://localhost:3000

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker

```bash
# Build Docker image
docker build -t mybank/frontend:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://api-gateway:8080 \
  mybank/frontend:latest
```

## API Integration

The frontend integrates with the following backend services via API Gateway:

- **Auth Service** (`/api/v1/auth/*`)
  - POST `/register` - User registration
  - POST `/login` - User login
  - POST `/logout` - User logout
  - POST `/refresh` - Token refresh

- **PFM Core Service** (`/api/v1/pfm/*`)
  - GET `/assets` - Get asset summary
  - GET `/spending/analysis` - Get spending analysis

- **Payment Service** (`/api/v1/payment/*`)
  - POST `/transfer` - Execute transfer
  - GET `/{paymentId}` - Get payment details

- **Investment Service** (`/api/v1/invest/*`)
  - GET `/summary` - Get investment summary

## Key Features Implementation

### JWT Authentication

The API client automatically:
- Adds JWT tokens to all requests
- Refreshes expired tokens
- Redirects to login on auth failure

```typescript
// Automatic token handling in lib/api/client.ts
apiClient.get('/api/v1/pfm/assets')
```

### Form Validation

All forms use Zod schemas for validation:

```typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Data Fetching

React Query handles all server state:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['assets'],
  queryFn: async () => {
    const response = await pfmApi.getAssets();
    return response.data;
  },
});
```

### Responsive Design

Mobile-first design with Tailwind CSS:
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly interactions

## Deployment

### Kubernetes

Deploy to Kubernetes cluster:

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/frontend-deployment.yaml

# Access via NodePort
http://localhost:30000
```

### Docker Compose

```bash
# Start all services including frontend
docker-compose up -d frontend
```

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components and hooks
- Implement error boundaries
- Add loading states
- Handle errors gracefully

### Component Guidelines

- Keep components small and focused
- Use composition over inheritance
- Implement proper prop types
- Add JSDoc comments for complex logic

### State Management

- Use React Query for server state
- Use Zustand for client state (auth)
- Keep state as local as possible
- Avoid prop drilling with context

## Performance Optimization

- Next.js automatic code splitting
- Image optimization with next/image
- Route prefetching
- React Query caching
- Lazy loading components

## Security

- JWT token management
- XSS protection
- CSRF protection via SameSite cookies
- Secure HTTP-only cookies (when applicable)
- Input validation with Zod
- Output sanitization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - MyBank 360 Project
