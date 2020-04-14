drop table crime_data;

create table crime_data(
	index INT NOT NULL PRIMARY KEY,
	crime_type VARCHAR (50),
	report_date VARCHAR (30),
	Beat VARCHAR (10),
	Neighborhood VARCHAR (100),
	NPU VARCHAR (10),
	lat VARCHAR (100),
	lon VARCHAR (100));