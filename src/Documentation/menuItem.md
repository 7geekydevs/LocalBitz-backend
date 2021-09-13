# Documentation :

## Menu Item Model :

### Collection of requests related to Menu Item Model : 

## GET My Menu

Authentication : Bearer Token

### Returns :

##### endpoint /menu/me

- if no menu items are present for cook then returns empty list

- if menu items present the returns list of menu items

- if cookToken invalid returns Error : Please Authenticate 

## GET Cook's Menu

Authentication : Not required

### Returns

##### endpoint /menu?cook=id

- if no menu items are present for cook then returns empty list

- if menu items present the returns list of menu items

- if cookToken invalid returns empty List

- if token passed is not object Id there is no response

## POST Menu Item :

Authentication : Bearer Token

### Returns : 

##### endpoint /menu

- instance of menu item model with client values if entry is successfully created.

- required error if one of required fields is not provided

- value type error if value passed is of incorrect datatype

## PATCH menu item :

Authentication : Bearer Token

### Returns :

##### endpoint /menu/:id

- instance of menu item model with client values if entry is successfully created.

- Error : Invalid Updates if non allowed field is updated

- Error: No Menu Item found! if menu item not found

## DELETE menu item

Authentication : Not Required

### Returns :

##### endpoint /menu/:id

- Error: No Menu Item found! if item not found

- Instance of deleted menu item if entry deleted successfully
