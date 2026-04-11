create database DreamHomeDB
use DreamHomeDB



create table admin(
	id int primary key identity,
	name varchar(100),
	username nvarchar(100),
	password nvarchar(100),
	)


CREATE TABLE Users ( --seller
    id INT PRIMARY KEY IDENTITY(1,1),
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(100),
    cnic VARCHAR(15),
    country VARCHAR(50),
    city VARCHAR(50),
    gender VARCHAR(10)
);



CREATE TABLE PropertyDetails (
    PropertyID INT IDENTITY(1,1) PRIMARY KEY,
    PropertyType NVARCHAR(50),
    PropertyLocation NVARCHAR(255),
    PropertySize NVARCHAR(50),
    AskingPrice DECIMAL(18,2),
    ContactName NVARCHAR(100),
    ContactPhone NVARCHAR(20),
    ContactEmail NVARCHAR(100),
    PropertyDescription NVARCHAR(MAX),
    PropertyImages NVARCHAR(MAX),  
    CreatedAt DATETIME DEFAULT GETDATE(),
	Status VARCHAR(20) DEFAULT 'available'
);

select * from PropertyDetails

CREATE TABLE AgentDetails (
    AgentID INT PRIMARY KEY IDENTITY(1,1),
    AgentName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Phone NVARCHAR(20),
    AgencyName NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE()
);

select * from AgentDetails


