## Hono Kit

### Auth

#### Register

- Method: POST
- Path: /auth/register
- Request Body
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- Response Body
  ```json
  {
    "token": "string"
  }
  ```

#### Login

- Method: POST
- Path: /auth/login
- Request Body
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- Response Body
  ```json
  {
    "token": "string"
  }
  ```

#### Get User Information

- Method: GET
- Path: /auth/info
- Request Header
  ```http
  Authorization: Bearer <token>
  ```
- Response Body
  ```json
  {
    "name": "string",
    "avatar": "string",
    "email": "string",
    "registrationDate": "string",
    "accountId": "number",
    "role": "string",
    "quota": "number",
    "usedQuota": "number",
    "requestCount": "number",
    "group": "string",
    "affCode": "string",
    "inviterId": "number"
  }
  ```

#### Change Password

- Method: POST
- Path: /auth/changePassword
- Request Header
  ```http
  Authorization: Bearer <token>
  ```
- Request Body
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- Response Body
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

#### Get Users List

- Method: GET
- Path: /auth/users
- Request Header
  ```http
  Authorization: Bearer <token>
  ```
- Response Body
  ```json
  [
    {
      "id": "number",
      ...
    }
  ]
  ```

#### Toggle User Activation Status

- Method: POST
- Path: /auth/active
- Request Header
  ```http
  Authorization: Bearer <token>
  ```
- Request Body
  ```json
  {
    "id": "number"
  }
  ```
- Response Body
  ```json
  {
    "message": "Active changed successfully"
  }
  ```

### Bilibili

#### Get Subtitle

- Method: POST
- Path: /bilibili/subtitle
- Request Body
  ```json
  {
    "bvid": "string",
    "sessdata": "string"
  }
  ```
- Response Body
  ```json
  {
    // as bilbili
  }
  ```

### Bing

#### Daily Image

- Method: GET
- Path: /bing/img
- Response Body
  ```json
  {
    "url": "string",
    "copyright": "string",
    "title": "string"
  }
  ```

### Chat

#### Fetch Models

- Method: POST
- Path: /chat/models
- Request Body
  ```json
  {
    "url": "string",
    "apikey": "string"
  }
  ```
- Response Body
  ```json
  [
    // ...
  ]
  ```

#### Cloudflare Model Execution

- Method: POST
- Path: /chat/cloudflare
- Request Body
  ```json
  {
    "model": "string",
    "prompt": "string",
    "stream": "boolean"
  }
  ```
- Response Body
  Same as Cloudflare

### Cloudflare

#### Execute GraphQL Query

- Method: POST
- Path: /cloudflare/graphql
- Request Body
  ```json
  {
    "query": "string"
  }
  ```
- Response Body
  Same as Cloudflare

### Github

#### Fetch Commit History

- Method: POST
- Path: /github/commit
- Request Body
  ```json
  {
    "repo": "owner/repo"
  }
  ```
- Response Body
  ```json
  [
    {
      "sha": "string",
      "commit": {
        "author": {}
      }
    }
    // ...
  ]
  ```

### KV

#### List Keys

- Method: GET
- Path: /kv/list
- Response Body
  ```json
  {
    "keys": ["key1", "key2", "key3"]
  }
  ```

#### Read

- Method: POST
- Path: /kv/read
- Request Body
  ```json
  {
    "key": "string"
  }
  ```
- Response Body
  ```json
  {
    "value": "string"
  }
  ```

#### Write

- Method: POST
- Path: /kv/write
- Request Body
  ```json
  {
    "key": "string",
    "value": "string"
  }
  ```
- Response Body
  ```json
  {
    "message": "Value stored successfully"
  }
  ```

### LLM

#### Get Token Count

- Method: GET
- Path: /llm/num
- Response Body
  ```json
  number
  ```

#### Share Token

- Method: POST
- Path: /llm/share
- Request Body
  ```json
  {
  "user": <user_id>
  }
  ```
- Response Body
  ```json
  // shareable_token_url
  ```

### Maimemo

#### Retrieve Word ID

- Method: GET
- Path: /maimemo/id
- Query Parameters:
  - spelling: The word to retrieve the ID for (e.g., "apple").
- Response Body:
  ```json
  {
    "id": "string", // The ID of the word.
    "spelling": "string"
  }
  ```

### Message

#### Send Message

- Method: POST
- Path: /msg/:user/:channel
  - user: The ID of the user sending the message.
  - channel: The communication channel to use (currently only supports `corp`).
- user
  - admin
- Channel
  - corp
- Request Body
  ```json
  {
    "from": "string",
    "title": "string",
    "desc": "string",
    "content": "string"
  }
  ```

### [THS](https://www.10jqka.com.cn/)

#### Request Token

- Method: POST
- Path: /ths/token
- Request Body
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- Response Body

  ```json
  {
    "refresh_token": "string",
    "expired_time": "string"
  }
  ```

### TTS

Reverse Proxy https://tts.xbxin.com/v1/audio/speech
