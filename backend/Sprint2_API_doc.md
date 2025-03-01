# Project: GF
APIs for Gator Fish

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
