# Dinujaya Flora - Flower Shop System

A complete e-commerce platform for a flower shop with admin dashboard, user shopping experience, and integrated PayHere payment gateway.

## Features

### Customer Features

- Browse and search flowers
- Add items to cart
- Secure checkout with PayHere payment gateway
- User authentication and profile management
- Order tracking

### Admin Features

- Product management
- Order management
- User management
- Supplier management
- Dashboard analytics

### Payment Integration

- PayHere sandbox payment gateway
- Secure payment processing
- Real-time payment notifications
- Order confirmation

## Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB
- PayHere merchant account

### Installation

1. Clone the repository

```bash
git clone https://github.com/rumesh02/dinujaya-flora.git
cd dinujaya-flora
```

2. Run setup script

```bash
setup.bat
```

3. Start the application

```bash
start.bat
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## PayHere Payment Testing

The system is configured with PayHere sandbox mode for testing.

### Test Cards

**Successful Payment:**

- Card: 5555 5555 5555 4444
- Expiry: Any future date (12/25)
- CVV: 123

**Failed Payment:**

- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: 123

For detailed integration documentation, see [PAYHERE_INTEGRATION.md](PAYHERE_INTEGRATION.md)

## Environment Variables

### Backend (.env)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYHERE_MERCHANT_ID=1230340
PAYHERE_MERCHANT_SECRET=MTY0MDExMjQzMzM5NTM2MzA4NjAxMDE1OTAyNjcxMzIzMjAwNTA0NA==
PAYHERE_SANDBOX=true
```

## Technology Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Axios
- Lucide Icons

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- PayHere Payment Gateway

## Project Structure

```
dinujaya-flora/
├── backend/              # Node.js backend
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── frontend/            # React frontend
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # React context
│       ├── pages/       # Page components
│       └── services/    # API services
└── PAYHERE_INTEGRATION.md  # Payment integration docs
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](LICENSE)

## Support

For issues or questions, please contact support@dinujayaflora.com
