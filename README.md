# Description

Technical Exercise: Order Management API

# Overview

This project is designed to allow 2 kinds of types of users (customers and admins) to facilitate running the store that is spread out on different branhces (locations)

# Philosophy

The intended philosophy was that customers were able to view the coffee shop locations and products, but needed to authenticate in order to create and track their orders.
The store has multiple locations and each location has its own set of available products. The admins create the locations, products, etc...
Each location would has a set amount of products (denoted by their quantity), and the orders would go to a specific location where it would check if the products their are sufficient to issue the order, and then process it for the customer.
Each location has a set of opening hours and closing rules, where opening hours would be for example: "Mon => Fri : 9 AM => 10 PM". The closing rules would be the periods in which the location is offline (ex: public holidays).
The idea behind this implementation comes from 2 projects that have a 90% similar mechanism and workflow (the first is [Eatsalad](eatsalad.com), while the other is confidential :/)

# Steps to run the project

1. Setup the `.env` variables (you may copy them from `.env.example`)

2.

```bash
pnpm i

npx prisma migrate:dev

# Sometimes the prisma client doesn't generate the client in the `generated` folder from the above command
# So we have to redo it manually
npx prisma generate

pnpm start:dev
```

You may experience some problems of locating the prisma client, it is because of the new prisma mechanism and updates.
I didn't 100% double check its correctness to save time

# Future Improvements

- The `password` in the `User` model can be extracted into a new model called `Auth` so it can facilitate social logins and keep pointing all authentication methods to the same account
- The usage of PubSub can be used to process orders at a high rate
- We usually use RateLimiting through AWS, but it can be done on the NestJS level
- Microservices can be integrated so we can split the `User`, `Location` and `Order` modules into separate instances
- We can prefix the API url with `/api/v1` to enable version control, but I didn't want to over-engineer this exercise
