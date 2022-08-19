### Built With

* React v18
* Bootstrap v5.2
* Typescript v4.7.4
* Golang v1.19
* OpenAPI v3

## Getting Started

```sh
docker-compose up -d
```

Open web browser to visit:
* Web UI: [http://localhost:3000/](http://localhost:3000/)
    - email: tack@example.com
    - password: 123456
* PGAdmin: [http://localhost:8081/](http://localhost:8081/)
    - username: admin@example.com
    - password: postgres
* SwaggerUI: [http://localhost:8082/](http://localhost:8082/)

### Prerequisites

* docker & docker-compose installed ready
  [https://www.docker.com/](https://www.docker.com/)
* soda cli installed ready
  [https://gobuffalo.io/documentation/database/soda/](https://gobuffalo.io/documentation/database/soda/)
* firebase auth account
  [https://firebase.google.com/firebase/authentication](https://firebase.google.com/firebase/authentication)

### Setup Database

1. Edit database.yml with your database config
2. Edit .env file (you may refer to example.env)
2. ```sh
   soda create -e development
   ```
3. ```sh
   soda migrate up
   ```
### Setup Firebase Auth

1. Create a free firebase account
2. Create a new project
3. Click on Build -> Authentication -> Get Started
4. Enable Email/Password providers
5. Go to Project Overview -> Project Settings -> Service accounts
6. Generate new Private Key
7. Copy your downloaded private key to the project and name it as service-account-file.json
8. Go to firebase create a new web app
9. Copy the firebase config to .env (Refer to example.env file)
