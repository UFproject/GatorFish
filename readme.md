# **GatorFish**

### **Project Description**

GatorFish is a user-friendly web application designed to simplify the process of buying and selling goods online. Inspired by platforms like eBay, our app allows users to create listings for items they wish to sell, browse a wide variety of products, and connect with potential buyers and sellers seamlessly. The platform is focused on providing a safe, intuitive, and feature-rich environment for peer-to-peer commerce.

### **Features**

#### **Core Features**

1. **User Authentication**
   - Secure sign-up and login system
   - Profile management with user information
   - Password change functionality

2. **Product Management**
   - Create, edit, and delete product listings
   - Upload product images with descriptions
   - Categorize items for better organization

3. **Search and Filtering**
   - Search for items using keywords
   - Filter results by categories
   - View detailed product information

4. **User Interactions**
   - Contact sellers directly through the platform
   - Like and save favorite items
   - View your posted and liked items in your profile

5. **Recommendation System**
   - Get personalized item recommendations based on browsing history
   - Discover new items on the home page

## Getting Started

### Prerequisites

- **Backend**:
  - Go (v1.16 or higher)
  - MySQL (v8 or higher)
  - Redis (optional, for caching)

- **Frontend**:
  - Node.js (v14 or higher)
  - npm (v6 or higher)

### Installation

#### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/GatorFish.git
   cd GatorFish
   ```

2. Configure the database:
   - Create a MySQL database for the application
   - Update the database connection settings in `backend/config/config.yaml`

3. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   go mod download
   ```

4. Start the backend server:
   ```bash
   go run main.go
   ```
   The backend server will run on http://localhost:8080

#### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend/my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend application will run on http://localhost:3000

### Testing

#### Backend Tests
```bash
cd backend
go test ./...
```

#### Frontend Tests
```bash
cd frontend/my-app
npm test
```

#### End-to-End Tests
```bash
cd frontend/my-app
npm run cypress:open  # For interactive testing
npm run cypress:run   # For headless testing
```

## Using GatorFish

### Account Management

#### Registration and Login

1. **Creating an Account**:
   - Click the "Sign Up" button in the top-right corner
   - Fill in your details (username, email, phone number, and password)
   - Click "Register" to create your account

2. **Logging In**:
   - Click the "Login" button
   - Enter your username and password
   - Click "Login" to access your account

3. **Changing Password**:
   - Navigate to your profile page
   - Click "Change Password"
   - Enter your old password and new password
   - Click "Update" to save changes

### Browsing Items

1. **Home Page Browsing**:
   - The home page displays recommended items
   - Scroll through the items to browse the available products

2. **Category Browsing**:
   - Click on any category from the navigation menu
   - Browse items within the selected category

3. **Search Functionality**:
   - Use the search bar at the top of any page
   - Enter keywords related to the items you're looking for
   - Press Enter or click the search icon to see results

### Item Details

1. **Viewing Item Details**:
   - Click on any item card to see detailed information
   - View images, descriptions, price, and seller information

2. **Contacting Sellers**:
   - On the item details page, click "Contact Seller"
   - View the seller's contact information (name, email, phone)
   - Use this information to reach out to the seller directly

### Managing Your Items

1. **Creating a Listing**:
   - Click "Sell" in the navigation menu
   - Fill in the item details (title, description, category, price)
   - Upload an image of your item
   - Click "Submit" to publish your listing

2. **Editing a Listing**:
   - Navigate to your profile page
   - Find the item under "My Listings"
   - Click "Edit" on the item you want to modify
   - Update the information and click "Save Changes"

3. **Removing a Listing**:
   - Navigate to your profile page
   - Find the item under "My Listings"
   - Click "Delete" to remove the listing

### Favorites and Likes

1. **Liking Items**:
   - Click the heart icon on any item card or details page
   - The item will be added to your "Liked Items"

2. **Viewing Liked Items**:
   - Navigate to your profile page
   - See all your liked items under the "Favorites" section

3. **Removing from Likes**:
   - Click the filled heart icon on a liked item
   - The item will be removed from your "Liked Items"

## API Documentation

The backend provides RESTful APIs for all functionality. Key endpoints include:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/change` - Change password
- `POST /auth/profile` - Get user profile

### Items
- `POST /items/create` - Create a new item listing
- `POST /items/update` - Update an existing item
- `POST /items/id` - Get item by ID
- `POST /items/Category` - Get items by category
- `POST /items/Search` - Search for items
- `POST /items/recommend` - Get recommended items

### User Interactions
- `POST /items/AddLike` - Add an item to liked items
- `POST /items/RemoveLike` - Remove an item from liked items
- `POST /behavior/view` - Record user viewing behavior

## Troubleshooting

If you encounter any issues while using GatorFish:

1. **Login Problems**:
   - Ensure your username and password are correct
   - Check that the backend server is running

2. **Image Upload Issues**:
   - Verify the image format is supported (JPG, PNG)
   - Ensure the file size is under the upload limit

3. **API Connection Errors**:
   - Check that both backend and frontend servers are running
   - Verify your network connection
   - Check the browser console for specific errors

4. **Database Connection Issues**:
   - Verify your database credentials in the config.yaml file
   - Ensure your MySQL server is running

### **Project Members**

- **Siyuan Pan** (Back-End)
- **Chuming Wang** (Front-End)
- **Jingwen Liu** (Back-End)
- **Ganyuan Chang** (Front-End)