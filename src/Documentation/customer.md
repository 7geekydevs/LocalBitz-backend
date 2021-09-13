# Documentation

## Customer Model :

### Collection of requests related to Customer Model :

## GET Profile

Authentication : Bearer Token

### Returns :

##### endpoint /customers/me

- "error": "Please authenticate" if not authenticated

-  instance of cook model if authentication successfull

## POST Register Customer

Authentication : Not required

### Returns :

##### endpoint /customers

- customer model on successful creation of entry in db.

- ValidationError if invalid parameters are entered / required param is missing.

## POST Customer Login

Auhentication : Not Required

### Returns : 

##### endpoint /customers/login

- customer model if authentication successful

- Error: Customer not found if customer not present in database.

- ValidationError if invalid parameters are entered / required param is missing.

## POST Customer Logout :

Authentication : Bearer Token

### Returns :

##### endpoint /customers/logout

- status code 200 if logout successful

- "error": "Please authenticate" if logout unsuccessfull

## PATCH Customer :

Authentication : Bearer Token

### Returns : 

##### endpoint /customers/me

- error if client tries to edit uneditable fields or provided value fails validation
- instance of customer model with updated values

### Editable fields :
- name
- email
- password
- address
- favouriteItems

## DELETE Customer

Authentication : Bearer Token

### Returns : 

##### endpoint /customers/me

- "error": "Please authenticate" if not logged in 

- Deleted Customer model if request successful