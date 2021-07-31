# fuzzy-spoon

API with a single endpoint that fetches the data from the MongoDB collection and return the results in the requested format

### Requirements

* nodejs version >= 14
* npm version >= 7
* mongoDB

### Install and run

* `npm i`
* set environment variables `PORT` and `MONGODB_CONNECTION_URL`
* `npm start` - run both client and server

### API

After server is started you can send a POST request it.

#### Request Payload
The request payload will include a JSON with 4 fields:
- `startDate` and `endDate` fields will contain the date in a `YYYY-MM-DD` format. They are used to filter the data using `createdAt` property.
- `minCount` and `maxCount` are for filtering the data. Sum of the `count` array in the documents should be between `minCount` and `maxCount`.

Sample: 
```javascript
{
    "startDate": "2016-01-26", 
    "endDate": "2018-02-02", 
    "minCount": 2700, 
    "maxCount": 3000
}
```  

#### Response Payload
Response payload has 3 main fields:
- `code` is for status of the request. 0 means success. Other values may be used
for errors that you define.
- `msg` is for description of the code. It contains “success” for successful
requests. For unsuccessful requests it provides explanatory messages.
- `records` will include all the filtered items according to the request. This array should include items of `key`, `createdAt` and `totalCount` which is the sum of the `counts` array in the document.

Sample:
```javascript
{
  "code": 0, 
  "msg": "Success", 
  "records": [
    {
      "key":"TAKwGc6Jr4i8Z487", 
      "createdAt":"2017-01-28T01:22:14.398Z", 
      "totalCount":2800
    }, {
      "key":"NAeQ8eX7e5TEg7oH", 
      "createdAt":"2017-01-27T08:19:14.135Z", 
      "totalCount":2900
    } 
  ]
}
```
