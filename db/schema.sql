DROP DATABASE IF EXISTS magicshoes;
CREATE DATABASE magicshoes;
\connect magicshoes;

DROP TABLE IF EXISTS shoes;
CREATE TABLE shoes (
  shoeID VARCHAR(60),
  shoeName VARCHAR(60),
  price VARCHAR(60),
  shoeLine VARCHAR(60)
);

DROP TABLE IF EXISTS colors;
CREATE TABLE colors (
  id VARCHAR(60),
  shoeID VARCHAR(60),
  url VARCHAR(500)
);

COPY shoes FROM '/Users/tony/Documents/Hack_Reactor/sdc/shoe_name_and_colors/db/shoes.csv' DELIMITERS ',' CSV;
COPY colors FROM '/Users/tony/Documents/Hack_Reactor/sdc/shoe_name_and_colors/db/colors.csv' DELIMITERS ',' CSV;