NestJs (Framework => Forces you to use modular code => Which is a good practice)
TypeORM / SEQUELIZE / PRISMA (To create Entities + simpler database querying)
Passport + JWT Tokens for Login Stored in the cookies
AuthGuards(From NestJs) for Routes/Api Security (Authentication/Authorization)
Swagger
Postgres(Db)

To use protected routes:
Just add @UseGuards(JwtAuthGuard)

