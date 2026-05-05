use onlineshop

db.createUser({
  user: "readUser",
  pwd: "1234",
  roles: [
    { role: "read", db: "onlineshop" }
  ]
});

use admin

db.createUser({
  user: "writeUser",
  pwd: "1234",
  roles: [
    { role: "readWrite", db: "onlineshop" }
  ]
});