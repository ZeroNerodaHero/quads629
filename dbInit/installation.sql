USE data;
CREATE TABLE activeRequest(
    name varchar(100),
    phoneNum varchar(12) UNIQUE,
    email varchar(100),
    locationX double,
    locationY double,
    location varchar(1000),
    descript varchar(3000),
    request_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    photoLinks varchar(3000),

    currentRequestId int NOT NULL AUTO_INCREMENT,
    status int DEFAULT 0,
    expectedInvoice int,
    expectedInvoiceString varchar(3000),
    PRIMARY KEY(currentRequestId)
);

CREATE TABLE oldRequest(
    name varchar(100),
    phoneNum int,
    email int,
    locationX double,
    locationY double,
    location varchar(1000),
    descript varchar(3000),
    request_time TIMESTAMP,
    finish_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    requestId int,
    invoiceTotal double,
    invoiceString varchar(3000),

    stars int,
    customerReview varchar(3000)
);
