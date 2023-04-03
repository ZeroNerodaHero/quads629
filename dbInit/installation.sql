USE data;
CREATE TABLE activeRequest(
    name varchar(100),
    phoneNum int,
    email int,
    locationX double,
    locationY double,
    location_string varchar(1000),
    descript varchar(3000),
    request_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    photoLinks varchar(3000)

    currentRequestId int NOT NULL AUTO_INCREMENT,
    status int DEFAULT 0
);

CREATE TABLE oldRequest(
    first_name varchar(100),
    last_name varchar(100),
    phoneNum int,
    email int,
    locationX double,
    locationY double,
    location_string varchar(1000),
    request_time TIMESTAMP,
    finish_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    requestId int,
    costTotal double,
    costString int,

    stars int,
    customerReview varchar(3000)
);
