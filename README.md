# [WARP-V] Nike Jordan Shoes Display - Name/ Colors

> Nike's Air Jordan online store allows the user to select a certain shoe, view the shoe name, color options, other related shoes, and several other features all on the same page. This module focuses on displaying the shoe name and all the other color choices for that certain shoe.

## Related Projects

  - https://github.com/WARP-V/main_photo_gallery
  - https://github.com/WARP-V/Navigation-Search-Service
  - https://github.com/WARP-V/page-footer
  - https://github.com/WARP-V/Sizing-Cart_Service
  - https://github.com/WARP-V/Review-Service

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Created by Vignesh Balasundaram

> All rights reserved. Liscence: ISC

> Install the npm dependencies and seed the database before building webpack bundle

> Server runs on port 3006

API ROUTES:

Get('/:shoeID/colors') Gets all the information for the shoe.
Get('/:shoeID/colors/:style') Gets the style information for the shoe.

Post('/new/shoe') Creates a new shoe.

Delete('/:shoeId/delete') Deletes a shoe.

Patch('/:shoeId/update') Updates the information for a shoe.

## Requirements

- Node 10.12.0
- MongoDB ^3.1.8

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

### Initial Startup

STARTUP INSTRUCTIONS:

1. Run startup script "seed" to seed the database

2. Run startup script "build" to create webpack bundle

3. Start express server with npm start


```sh
npm run seed
npm run build
npm start
```
