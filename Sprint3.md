
# Backend Unit Testing Documentation

## Introduction
Sprint 3 unit test document describes the unit tests implemented for the backend services. The tests ensure that key functionalities operate correctly, including getting user profile, changing password, updating item, and item like management.

## Test Cases

### 1. Profile Controller Test (`TestProfileController`)
#### Description
Tests the `/auth/profile` endpoint for handling profile requests.
#### Test Scenarios
- **Valid Profile Request**: Valid username returns profile data.
- **Missing Username**: Missing input leads to `400 Bad Request`.
- **Invalid JSON Format**: Malformed JSON request returns `400 Bad Request`.
#### Expected Results
- Proper requests return `200 OK`.
- Malformed or incomplete requests return `400 Bad Request`.

---

### 2. Change Password Controller Test (`TestChangePasswordController`)
#### Description
Tests the `/auth/change` endpoint for password change functionality.
#### Test Scenarios
- **Valid Password Change**: Correct old password and fields change the password successfully.
- **Wrong Old Password**: Incorrect old password returns `401 Unauthorized`.
- **User Not Found**: Nonexistent username returns `401 Unauthorized`.
- **Missing Fields**: Missing required fields returns `400 Bad Request`.
#### Expected Results
- Successful changes return `200 OK`.
- Invalid or incomplete data returns proper error status.

---

### 3. Like Controllers Test (`TestLikeControllers`)
#### Description
Tests the endpoints for liking and unliking items.
#### Test Scenarios
- **Add Like - Valid**
- **Add Like - Missing Username**
- **Add Like - Invalid Item ID**
- **Add Like - Item already liked**
- **Remove Like - Valid**
- **Remove Like - Like Not Exist**
- **Remove Like - Missing Item ID**
#### Expected Results
- Valid like/unlike actions return `200 OK`.
- Invalid or duplicate actions return `400 Bad Request`.

---

### 4. Update Item Controller Test (`TestUpdateItemController`)
#### Description
Tests the `/items/update` endpoint to ensure item updates are handled correctly.
#### Test Scenarios
- **Valid Update Request**
- **Missing item_id**
- **Invalid price format**
- **Invalid JWT**
- **Item Not Found**
- **Unauthorized Update Attempt**
#### Expected Results
- Valid updates return `200 OK`.
- Errors return `400`, `401`, `403`, or `404` based on the cause.

# Backend API Document

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
		"Username"  :"Anna",
		"Password"  :"abcdef",
		"Phone"    :"136",
		"Email"    :"Anna@ufl.edu"
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

## End-point: change password
Change user's password

| variable name | necessity |
| --- | --- |
| Username | Yes |
| old_password | Yes |
| old_password | Yes |
### Method: POST
>```
>http://{{ip}}:8080/auth/change
>```
### Body (**raw**)

```json
{
		"Username"  :"Anna",
		"old_password"  :"abcdef",
		"new_password"    :"114514"
}
```

### Response: 200
```json
{
    "message": "Password updated successfully"
}
```

### Response: 400
```json
{
    "error": "Invalid request payload"
}
```

### Response: 401
```json
{
    "error": "User not found"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: add like
Add an item to user's "like" folder

| variable name | necessity |
| --- | --- |
| username | Yes |
| item_id | Yes |
### Method: POST
>```
>http://{{ip}}:8080/items/AddLike
>```
### Body (**raw**)

```json
{
		"username"  :"Anna",
		"item_id"  :1
}
```

### Response: 200
```json
{
    "message": "Item liked successfully"
}
```

### Response: 400
```json
{
    "error": "username and valid item_id are required"
}
```

### Response: 400
```json
{
    "error": "Item already liked"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: remove like
Remove an item from user's "like" folder

| variable name | necessity |
| --- | --- |
| username | Yes |
| item_id | Yes |
### Method: POST
>```
>http://{{ip}}:8080/items/RemoveLike
>```
### Body (**raw**)

```json
{
		"username"  :"Anna",
		"item_id"  :1
}
```

### Response: 200
```json
{
    "message": "Item unliked successfully"
}
```

### Response: 400
```json
{
    "error": "username and valid item_id are required"
}
```

### Response: 400
```json
{
    "error": "Like does not exist"
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

## End-point: updateItem
Update item's information

|  | necessity |
| --- | --- |
| seller_jwt | Yes |
| category_name | Yes |
| title | Yes |
| description | Yes |
| price | Yes |
| file | Yes |
| item_id | Yes |
### Method: POST
>```
>http://{{ip}}:8080/items/update
>```
### Body formdata

|Param|value|Type|
|---|---|---|
|seller_jwt|Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM0MzU0MzYsInVzZXJuYW1lIjoiQW5uYSJ9.Zysc4ORqazCu6DJma7Io4bkNXc5KbOwv366DDhYU4ys|text|
|category_name|Electronics|text|
|title|Smartphone_1|text|
|description|Latest model with 64GB|text|
|price|12|text|
|file|/home/siyuan/Desktop/Screenshot_20250223_165652.png|file|
|item_id|1|text|


### Response: 200
```json
{
    "message": "Item updated successfully",
    "updates": {
        "category_name": "Electronics",
        "description": "Latest model with 64GB",
        "price": 88,
        "title": "Smartphone_1"
    }
}
```

### Response: 400
```json
{
    "error": "Invalid price format"
}
```

### Response: 400
```json
{
    "error": "Invalid item_id"
}
```

### Response: 401
```json
{
    "error": "Invalid or missing JWT"
}
```

### Response: 403
```json
{
    "error": "Unauthorized to update this item"
}
```

### Response: 404
```json
{
    "error": "Item not found"
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
### Body (**raw**)

```json

```

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
    "liked_items": [
        {
            "Item_id": 1,
            "Seller_name": "Anna",
            "Category_name": "Electronics",
            "Title": "Smartphone_1",
            "Description": "Latest model with 64GB",
            "Price": 88,
            "Posted_date": "2025-02-24T16:57:58-05:00",
            "Status": "inactive",
            "Pic": "/uploads/animals01.jpg"
        }
    ],
    "posted_items": [
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
  "item_id": 42
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
