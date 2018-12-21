DROP DATABASE IF EXISTS magicshoes;
CREATE DATABASE magicshoes;
\connect magicshoes;

DROP TABLE IF EXISTS shoes;
CREATE TABLE shoes (
  shoeId SERIAL PRIMARY KEY,
  shoeName VARCHAR(60),
  price VARCHAR(60),
  shoeLine VARCHAR(60)
);

DROP TABLE IF EXISTS colors;
CREATE TABLE colors (
  id SERIAL PRIMARY KEY,
  shoeId INT,
  url VARCHAR(200) NOT NULL
);

-- shoeId INT REFERENCES shoes (shoeId),

\COPY shoes(shoeId, shoeName, price, shoeLine) FROM '/Users/tony/Documents/Hack_Reactor/sdc/shoe_name_and_colors/db/shoes.csv' DELIMITERS ',' CSV HEADER;
\COPY colors(id, shoeId, url) FROM '/Users/tony/Documents/Hack_Reactor/sdc/shoe_name_and_colors/db/colors.csv' DELIMITERS ',' CSV HEADER;