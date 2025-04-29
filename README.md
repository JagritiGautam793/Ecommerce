# SnappyCart

A mobile e-commerce application built with React Native and Expo, featuring a complete shopping experience from browsing to checkout.

## Core Features

### Authentication

- JWT-based authentication
- User registration and login
- Persistent login with AsyncStorage
- Protected routes

### Product Management

- Browse product catalog
- Search functionality with debouncing
- Product categorization
- Detailed product views

### Shopping Cart

- Redux-based cart management
- Add/Remove items
- Quantity adjustments
- Cart total calculation
- Flying animation for cart additions
- Cart persistence across sessions

### Checkout Process

- Multiple delivery address management
- Order summary
- Payment integration (Razorpay)
- Order confirmation
- Order history tracking

### User Profile

- View and edit user details
- Manage delivery addresses
- Track order history
- Order status tracking
- Logout

## Technical Stack

### Frontend

- React Native with Expo
- Redux for state management
- AsyncStorage for data persistence
- React Navigation
- Axios for API calls

### Backend

- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- RESTful API architecture

### Key Libraries

- @reduxjs/toolkit
- react-native-razorpay
- react-native-reanimated

## Getting Started

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   cd api && npm install
   \`\`\`

3. Configure environment variables:

- Create .env file with:
  ```
  MONGODB_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
  RAZORPAY_KEY=your_razorpay_key
  ```

4. Start the servers:

- Backend: `cd api && npm start`
- Frontend: `npm start`

## API Endpoints

### Auth

- POST /register - User registration
- POST /login - User authentication

### Products

- GET /products - List products
- GET /products/:id - Get product details

### Cart & Orders

- POST /orders - Create order
- GET /orders/:userId - Get user orders

### Address

- POST /addresses - Add address
- GET /addresses/:userId - Get user addresses

## Contributing

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## License

MIT License

---

© 2025 E-commerce Mobile App
