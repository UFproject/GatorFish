# Project: GF

## Frontend Testing

### Unit Tests

#### Running Unit Tests

```bash
npm test
```

#### Homepage Tests
- renders AppAppBar component
- renders CategoryMenu component
- renders featured sections
- fetches and displays items from API
- shows login success notification when coming from login page


#### Product Page Tests
- renders product title
- renders product price
- renders seller information
- renders contact seller button
- renders product image with correct URL
- displays loading state when product is not available


#### SignIn Page Tests
- renders sign in form with all fields
- renders sign up link


#### Example Unit Tests

##### Homepage Tests

```javascript
describe('Homepage', () => {
  beforeEach(() => {
    // Setup mock responses for API calls
    request.post.mockImplementation((url, data) => {
      if (url === '/items/Category' && data.category_name === 'Electronics') {
        return Promise.resolve({
          items: [
            { id: 1, Title: 'Electronics Item 1', Price: 100, Pic: '/test1.jpg', Seller_name: 'Seller 1' }
          ]
        });
      }
      // Additional mock implementations...
    });
  });

  test('renders AppAppBar component', () => {
    render(<Homepage />);
    expect(screen.getByText('GATOR FISH MARKET')).toBeInTheDocument();
  });

  test('renders CategoryMenu component', () => {
    render(<Homepage />);
    expect(screen.getByText('Phones/Digital/Computers')).toBeInTheDocument();
  });

  test('fetches and displays items from API', async () => {
    render(<Homepage />);
    await waitFor(() => {
      expect(request.post).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(screen.getAllByText('Electronics Item 1')[0]).toBeInTheDocument();
    });
  });
});
```


##### Product Page Tests

```javascript
describe('Product', () => {
  beforeEach(() => {
    const mockUseLocation = require('react-router-dom').useLocation;
    mockUseLocation.mockImplementation(() => ({
      state: {
        product: {
          id: 1,
          Title: 'Test Product',
          Price: 99.99,
          Pic: '/images/test.jpg',
          Seller_name: 'Test Seller'
        }
      },
      search: '?id=1'
    }));
  });

  test('renders product title', () => {
    renderWithRedux(<Product />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('renders product price', () => {
    renderWithRedux(<Product />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  test('renders contact seller button', () => {
    renderWithRedux(<Product />);
    expect(screen.getByText('Contact Seller')).toBeInTheDocument();
  });
});
```


##### SignIn Page Tests

```javascript
describe('SignIn', () => {
  test('renders sign in form with all fields', () => {
    renderWithProviders(<SignIn />);
    expect(screen.getByText(/sign in/i, { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  test('renders sign up link', () => {
    renderWithProviders(<SignIn />);
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
});
```


### Cypress End-to-End Tests

#### Running Cypress Tests

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run tests headlessly
npm run cypress:run
```
#### Homepage Tests

- displays header with market name
- has search input field
- shows sign in button
- displays category menu
- can enter text in search field


#### Navigation Tests

- can click sign in button
- shows category navigation options
- allows typing in search field

#### Product Page Tests

- can visit a product page
- can navigate using browser back

#### SignIn Page Tests

- displays sign in form
- has username and password fields
- can type in login fields
- can navigate to sign up page

#### SignUp Page Tests

- can access sign up form
- has form fields
- can type in registration fields
- can navigate to sign in page


#### Category Tests

- can visit a category page

#### Search Tests

- can type in search field
- can clear search field after typing

#### Cypress Configuration

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    TEST_USERNAME: 'testuser',
    TEST_PASSWORD: 'password123',
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
});
```

#### Example Cypress Tests


##### Homepage Tests

```javascript
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays header with market name', () => {
    cy.contains('GATOR FISH MARKET').should('be.visible');
  });

  it('has search input field', () => {
    cy.get('input[placeholder="Search for anything"]').should('be.visible');
  });

  it('shows sign in button', () => {
    cy.contains('Sign In').should('be.visible');
  });

  it('displays category menu', () => {
    cy.contains('Phones/Digital/Computers').should('be.visible');
  });
});
```


##### Sign In Tests

```javascript
describe('Sign In', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays sign in form', () => {
    cy.get('form').should('be.visible');
  });

  it('has username and password fields', () => {
    cy.get('input[placeholder="username"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('can type in login fields', () => {
    cy.get('input[placeholder="username"]').type('test');
    cy.get('input[type="password"]').type('password123');
  });
});
```

##### Product Page Tests

```javascript
describe('Product Detail Page', () => {
  it('can visit a product page', () => {
    cy.visit('/item?id=1');
  });

  it('can navigate using browser back', () => {
    cy.visit('/');
    cy.visit('/item?id=1');
    cy.go('back');
    cy.contains('GATOR FISH MARKET').should('be.visible');
  });
});
```

## Backend Unit Testing Documentation

### Test Cases

#### 1. Upload Item Test (`TestUploadItem`)
#### Description
Tests the `/items/create` endpoint to verify item upload functionality with various inputs.
#### Test Scenarios
- **Valid Item Upload With Image**: Ensures that an item with all required fields and an image is successfully uploaded.
- **Valid Item Upload Without Image**: Verifies that an item can be uploaded even without an image.
- **Invalid Price Format**: Ensures that an incorrect price format results in a `400 Bad Request` response.
- **Invalid File Type**: Confirms that uploading a non-image file results in a `400 Bad Request` response.
#### Expected Results
- Successful uploads return `201 Created` with a success message.
- Invalid inputs return appropriate error messages and status codes.

---

#### 2. Insert User Behavior Test (`TestInsertUserBehavior`)
#### Description
Tests the `/behavior/view` endpoint to verify user behavior tracking functionality.
#### Test Scenarios
- **Valid Form Data**: Ensures correct behavior recording when all required fields are provided.
- **Missing JWT**: Ensures that missing authentication results in a `400 Bad Request` response.
- **Invalid Item ID**: Checks that an invalid item ID leads to a `400 Bad Request` response.
- **Missing Behavior Type**: Verifies that missing behavior type defaults to "unknown" but still succeeds.
#### Expected Results
- Valid requests return `200 OK`.
- Missing or invalid inputs return appropriate error messages and status codes.

---

#### 3. Recommend Items Test (`TestRecommendItems`)
#### Description
Tests the `/items/recommend` endpoint to verify item recommendation functionality.
#### Test Scenarios
- **Valid JWT & Default Product Number**: Ensures a valid request returns recommended items.
- **Valid JWT & Custom Product Number**: Ensures that specifying a product number returns the expected number of recommendations.
- **Invalid JWT**: Checks that an invalid JWT results in a `401 Unauthorized` response.
- **Invalid Product Number**: Ensures an incorrect product number leads to a `401 Unauthorized` response.
- **No JWT (Random Recommendation)**: Verifies that unauthenticated users can still receive recommendations.
#### Expected Results
- Successful requests return `200 OK` and a list of recommended items.
- Invalid JWT or product number results in `401 Unauthorized`.

---

#### 4. Authentication Controllers Test (`TestAuthControllers`)
#### Description
Tests the authentication-related endpoints to ensure proper login and profile retrieval.
#### Test Scenarios
- **Login Success**: Ensures that a user can successfully log in with valid credentials.
- **Profile Fetch**: Verifies that a valid user can retrieve their profile information.
#### Expected Results
- Successful login returns `200 OK`.
- Profile retrieval returns `200 OK` with user details.

---

#### 5. Item Controllers Test (`TestItemControllers`)
#### Description
Tests item-related endpoints to ensure correct retrieval of items based on category.
#### Test Scenarios
- **Get Items By Category**: Ensures that items belonging to a specified category are correctly retrieved.
#### Expected Results
- Valid category requests return `200 OK` with a list of items.

# Backend API Documentation

## End-point: register
User register

| variable name | necessity |
| --- | --- |
| Username | Yes |
| Password | Yes |
| Phone | Yes |
| Email | Yes |
### Method: POST
>```
>http://{{ip}}:8080/auth/register
>```
### Body (**raw**)

```json
{
		"Username"  :"Annie",
		"Password"  :"abcdef",
		"Phone"    :"136",
		"Email"    :"Annie@ufl.edu"
}
```

### Response: 200
```json
{
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDA5NTYyNzUsInVzZXJuYW1lIjoiQW5uaWUifQ.FKSPAdeExePBHqIzTk_vpfTVlMUu7BWbP9SYERg11TI"
}
```

### Response: 400
```json
{
    "error": "Error 1062 (23000): Duplicate entry 'Annie' for key 'users.PRIMARY'"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: login
User login

| variable name | necessity |
| --- | --- |
| Username | Yes |
| Password | Yes |
### Method: POST
>```
>http://{{ip}}:8080/auth/login
>```
### Body (**raw**)

```json
{
		"Username"  :"Anna",
		"Password"  :"114514"
}
```

### Response: 200
```json
{
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDEwMzMzMDksInVzZXJuYW1lIjoiQW5uaWUifQ.6qNBY3lXd2OINwskSE58sqSjWxQT1yNZ2M3sHMTKAGA"
}
```

### Response: 401
```json
{
    "error": "wrong username"
}
```

### Response: 401
```json
{
    "error": "wrong credentials"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: uploadItem
Upload user's items for sale

| variable name | necessity |
| --- | --- |
| seller_jwt | Yes |
| category_name | Yes |
| title | Yes |
| description | Yes |
| price | Yes |
| file | Yes |
### Method: POST
>```
>http://{{ip}}:8080/items/create
>```
### Body formdata

|Param|value|Type|
|---|---|---|
|seller_jwt|Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDA2MDU1MjMsInVzZXJuYW1lIjoiMTIifQ.RuZPNPejlIC_FVAfYvoYeLvSegVqxPqKgcesLurzX2g|text|
|category_name|Electronics|text|
|title|Smartphone_1|text|
|description|Latest model with 128GB|text|
|price|12|text|
|file|/home/siyuan/Desktop/Screenshot_20250223_165652.png|file|


### Response: 201
```json
{
    "item": {
        "Item_id": 0,
        "Seller_name": "",
        "Category_name": "Electronics",
        "Title": "Smartphone_2",
        "Description": "Latest model with 128GB",
        "Price": 12,
        "Posted_date": "2025-02-28T15:26:15.3862047-05:00",
        "Status": "active",
        "Pic": ""
    },
    "message": "Item uploaded successfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: user behavior record
Record user viewing, liking and buying behavior

| variable name | necessity |
| --- | --- |
| user_jwt | Yes |
| item_id | Yes |
| behavior_type | Yes |
### Method: POST
>```
>http://{{ip}}:8080/behavior/view
>```
### Body formdata

|Param|value|Type|
|---|---|---|
|user_jwt|Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDA4NjcxOTUsInVzZXJuYW1lIjoiQW5uYSJ9.lDA2mTZeffs7PJUGRT-tCwucctyyk_AM0cFruXMFnC8|text|
|item_id|1|text|
|behavior_type|view|text|


### Response: 200
```json
{
    "message": "User behavior recorded successfully"
}
```

### Response: 400
```json
{
    "error": "No username"
}
```

### Response: 400
```json
{
    "error": "Invalid item id"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: get recommend items
Get recommendations

| variable name | necessity |
| --- | --- |
| user_jwt | No |
| product_number | No |
### Method: POST
>```
>http://{{ip}}:8080/items/recommend
>```
### Body formdata

|Param|value|Type|
|---|---|---|
|user_jwt|Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDA4NjcxOTUsInVzZXJuYW1lIjoiQW5uYSJ9.lDA2mTZeffs7PJUGRT-tCwucctyyk_AM0cFruXMFnC8|text|
|product_number|5|text|


### Response: 200
```json
{
    "recommended_items": [
        {
            "Item_id": 42,
            "Seller_name": "12",
            "Category_name": "Electronics",
            "Title": "Smartphone_1",
            "Description": "Latest model with 128GB",
            "Price": 12,
            "Posted_date": "2025-02-23T16:55:51-05:00",
            "Status": "active",
            "Pic": ""
        },
        {
            "Item_id": 1,
            "Seller_name": "Anna",
            "Category_name": "Pets",
            "Title": "Long Horn Cattle",
            "Description": "Texas long horn cattle",
            "Price": 2000,
            "Posted_date": "2025-02-24T16:57:58-05:00",
            "Status": "active",
            "Pic": "/uploads/animals01.jpg"
        },
        {
            "Item_id": 2,
            "Seller_name": "Anna",
            "Category_name": "Pets",
            "Title": "Black Cat",
            "Description": "cat adoption",
            "Price": 100,
            "Posted_date": "2025-02-24T16:58:58-05:00",
            "Status": "active",
            "Pic": "/uploads/animals02.jpg"
        },
        {
            "Item_id": 3,
            "Seller_name": "Anna",
            "Category_name": "Pets",
            "Title": "Owl",
            "Description": "birds",
            "Price": 500,
            "Posted_date": "2025-02-25T16:58:58-05:00",
            "Status": "active",
            "Pic": "/uploads/animals03.jpg"
        },
        {
            "Item_id": 4,
            "Seller_name": "Anna",
            "Category_name": "Pets",
            "Title": "Tebby Cat",
            "Description": "cat adoption",
            "Price": 150,
            "Posted_date": "2025-02-25T16:59:58-05:00",
            "Status": "active",
            "Pic": "/uploads/animals04.jpg"
        }
    ]
}
```

### Response: 400
```json
{
    "error": "Failed to parse username"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Category
Get items by category

| variable name | necessity |
| --- | --- |
| category_name | Yes |
| start | Yes |
| end | Yes |
### Method: POST
>```
>http://{{ip}}:8080/items/Category
>```
### Body (**raw**)

```json
{
  "category_name": "Electronics",
  "start": 0,
  "end": 10
}

```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "category_name": "Electronics",
    "items": [
        {
            "Item_id": 42,
            "Seller_name": "12",
            "Category_name": "Electronics",
            "Title": "Smartphone_1",
            "Description": "Latest model with 128GB",
            "Price": 12,
            "Posted_date": "2025-02-23T16:55:51-05:00",
            "Status": "active",
            "Pic": ""
        },
        {
            "Item_id": 43,
            "Seller_name": "12",
            "Category_name": "Electronics",
            "Title": "Smartphone_1",
            "Description": "Latest model with 128GB",
            "Price": 12,
            "Posted_date": "2025-02-23T16:58:58-05:00",
            "Status": "active",
            "Pic": "/uploads/1740347938375260479_Screenshot_20250223_165652.png"
        },
        {
            "Item_id": 44,
            "Seller_name": "",
            "Category_name": "Electronics",
            "Title": "Smartphone_2",
            "Description": "Latest model with 128GB",
            "Price": 12,
            "Posted_date": "2025-02-28T15:26:15-05:00",
            "Status": "active",
            "Pic": ""
        },
        {
            "Item_id": 45,
            "Seller_name": "",
            "Category_name": "Electronics",
            "Title": "Smartphone_2",
            "Description": "Latest model with 128GB",
            "Price": 12.12,
            "Posted_date": "2025-02-28T15:26:42-05:00",
            "Status": "active",
            "Pic": ""
        }
    ]
}
```

### Response: 400
```json
{
    "error": "category_name is required"
}
```

### Response: 400
```json
{
    "error": "Invalid start or end values"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: profile
Get user liked items

| variable name | necessity |
| --- | --- |
| username | Yes |
### Method: POST
>```
>http://{{ip}}:8080/auth/profile
>```
### Body (**raw**)

```json
{
    "username": "12"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "items": [
        {
            "Item_id": 42,
            "Seller_name": "12",
            "Category_name": "Electronics",
            "Title": "Smartphone_1",
            "Description": "Latest model with 128GB",
            "Price": 12,
            "Posted_date": "2025-02-23T16:55:51-05:00",
            "Status": "active",
            "Pic": ""
        },
        {
            "Item_id": 43,
            "Seller_name": "12",
            "Category_name": "Electronics",
            "Title": "Smartphone_1",
            "Description": "Latest model with 128GB",
            "Price": 12,
            "Posted_date": "2025-02-23T16:58:58-05:00",
            "Status": "active",
            "Pic": "/uploads/1740347938375260479_Screenshot_20250223_165652.png"
        }
    ],
    "liked_item_ids": [
        12
    ],
    "username": "12"
}
```

### Response: 400
```json
{
    "error": "username is required"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: get item by ID
Get item by id

| variable name | necessity |
| --- | --- |
| item_id | Yes |
### Method: POST
>```
>http://{{ip}}:8080/items/id
>```
### Body (**raw**)

```json
{
  "item_id": 123
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "item": {
        "Item_id": 1,
        "Seller_name": "Anna",
        "Category_name": "Pets",
        "Title": "Long Horn Cattle",
        "Description": "Texas long horn cattle",
        "Price": 2000,
        "Posted_date": "2025-02-24T16:57:58-05:00",
        "Status": "active",
        "Pic": "/uploads/animals01.jpg"
    }
}
```

### Response: 400
```json
{
    "error": "Invalid JSON payload"
}
```

### Response: 404
```json
{
    "error": "Item not found"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
