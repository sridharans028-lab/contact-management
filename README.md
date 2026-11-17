# Contact Management System

A beginner-friendly full-stack project for **Task 3 – Database Connectivity using SQL, JDBC and Spring Boot**.

## Technology used

- Java 17+
- Spring Boot 3.5.16
- Spring Web
- Spring JDBC (`JdbcTemplate`)
- MySQL 8+
- HTML, CSS and JavaScript
- Maven

## Features

- Add a contact (name, phone and email)
- View all contacts
- Search contacts by name, phone or email
- Edit contact details
- Delete a contact
- Store contact records in MySQL using SQL queries through `JdbcTemplate`

## 1. Requirements

Install these tools:

1. JDK 17 or later
2. MySQL Server (MySQL Workbench is optional but recommended)
3. Apache Maven 3.6.3 or later
4. Visual Studio Code with the Extension Pack for Java (recommended)

Check the installations in the VS Code terminal:

```powershell
java -version
mvn -version
mysql --version
```

## 2. Create the database

1. Start MySQL Server.
2. Open MySQL Workbench and connect to your local MySQL instance.
3. Open `database/contact_management.sql`.
4. Execute the complete SQL script.
5. Confirm that the `contact_management` database and `contacts` table are created.

The table has four columns:

| Column | Type | Purpose |
|---|---|---|
| id | BIGINT, auto increment | Unique contact ID |
| name | VARCHAR(100) | Contact name |
| phone | VARCHAR(20) | Phone number |
| email | VARCHAR(120) | Email address |

## 3. Configure the MySQL password

Open:

`src/main/resources/application.properties`

The project defaults to MySQL username `root` and a blank password. If your MySQL root account has a password, set it in the file or create environment variables before starting the application.

For a quick local setup, change this line:

```properties
spring.datasource.password=${DB_PASSWORD:}
```

to your own local MySQL password, for example:

```properties
spring.datasource.password=your_mysql_password
```

Do not upload a real database password to a public GitHub repository.

## 4. Run the application

Open the extracted `Contact_Management_System` folder in VS Code. Open Terminal → New Terminal and run:

```powershell
mvn spring-boot:run
```

Wait until the terminal shows that the application has started. Then open:

[http://localhost:8080](http://localhost:8080)

The frontend is served by Spring Boot, so the HTML page and REST API use the same local server.

## 5. Test the application

Try adding this sample contact:

- Name: Rahul Kumar
- Phone: 9876543210
- Email: rahul@example.com

Then test Edit, Delete and Search. Refresh the browser and verify that the contacts remain saved in MySQL.

## 6. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/contacts` | Get all contacts |
| GET | `/api/contacts?search=rahul` | Search contacts |
| GET | `/api/contacts/{id}` | Get one contact |
| POST | `/api/contacts` | Add a contact |
| PUT | `/api/contacts/{id}` | Update a contact |
| DELETE | `/api/contacts/{id}` | Delete a contact |

Example JSON body for POST and PUT:

```json
{
  "name": "Rahul Kumar",
  "phone": "9876543210",
  "email": "rahul@example.com"
}
```

## Project structure

```text
Contact_Management_System/
├── database/
│   └── contact_management.sql
├── src/main/java/com/srm/contactmanagement/
│   ├── ContactManagementApplication.java
│   ├── controller/ContactController.java
│   ├── model/Contact.java
│   └── repository/ContactRepository.java
├── src/main/resources/
│   ├── application.properties
│   └── static/
│       ├── index.html
│       ├── style.css
│       └── script.js
├── pom.xml
└── README.md
```

## How JDBC is used

`ContactRepository` uses Spring's `JdbcTemplate` to execute parameterized SQL statements. It demonstrates `SELECT`, `INSERT`, `UPDATE` and `DELETE` operations against the MySQL `contacts` table.

This is a learning/demo application. It is intended for local coursework use, not production deployment without additional security, authentication and operational hardening.
