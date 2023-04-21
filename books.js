import { Router } from "express";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { validatemiddleware } from "./Middlewares/authentification.js";
const bookroutes = Router();

bookroutes.get("/categories", (req, res) => {
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "static";

  const client = new MongoClient(connectionString);
  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .find()
      .toArray()

      .then((data) => {
        res.json(data);
      });
  });
});
bookroutes.get("/books", (req, res) => {
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Books";

  const client = new MongoClient(connectionString);
  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .find()
      .toArray()

      .then((data) => {
        res.json(data);
      });
  });
});
bookroutes.get("/books/:category", (req, res) => {
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Books";

  const client = new MongoClient(connectionString);
  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .find({ category: req.params.category })
      .toArray()

      .then((data) => {
        res.json(data);
      });
  });
});
bookroutes.get("/books/:name/search", (req, res) => {
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Books";

  const client = new MongoClient(connectionString);
  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .find({ name: req.params.name })

      .toArray()

      .then((data) => {
        res.json(data);
      });
  });
});
bookroutes.get(
  "/authenticate/:email/:password",

  (req, res) => {
    const connectionString = process.env.CONNECTION_STRING;

    const database = process.env.DEFAULT_DATABASE;
    const collection = "Users";

    const client = new MongoClient(connectionString);

    client.connect().then((connection) => {
      const db = connection.db(database);

      db.collection(collection)
        .find({ email: req.params.email, password: req.params.password })
        .toArray()
        .then((datam) => {
          if (datam && datam.length > 0) {
            let obj = {
              email: req.params.email,
            };
            const token = jwt.sign(obj, process.env.PRIVATE_KEY, {
              expiresIn: "1hr",
            });
            return res.json({
              token,
              email: req.params.email,
              Name: datam[0].Name,
              avatar: datam[0].avatar,
              id: datam[0]._id,
            });
          } else {
            return res.json("Unauthorized");
          }
        });
    });
  }
);
bookroutes.get("/users", validatemiddleware, (req, res) => {
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Users";

  const client = new MongoClient(connectionString);

  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .find()
      .toArray()
      .then((data) => {
        res.json(data);
      });
  });
});

bookroutes.post("/users", (req, res) => {
  let body = req.body;
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Users";

  const client = new MongoClient(connectionString);

  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .insertOne(body)
      .then((data) => {
        res.json("Account created successfully");
      });
  });
});

bookroutes.post("/addbooks", validatemiddleware, (req, res) => {
  let body = req.body;
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Bookrating";

  const client = new MongoClient(connectionString);

  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .insertOne(body)
      .then((data) => {
        res.json("books added successfully");
      });
  });
});
bookroutes.put("/addlikes/:bookid/likes", (req, res) => {
  let likes = req.body.likes;
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Bookrating";

  const client = new MongoClient(connectionString);

  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .updateOne(
        { _id: new ObjectId(req.params.bookid) },
        { $set: { likes: likes } }
      )

      .then((data) => {
        res.json("likes added successfully");
      });
  });
});
bookroutes.get(
  "/addlikes/:bookid/likes",

  (req, res) => {
    const connectionString = process.env.CONNECTION_STRING;

    const database = process.env.DEFAULT_DATABASE;
    const collection = "Bookrating";

    const client = new MongoClient(connectionString);

    client.connect().then((connection) => {
      const db = connection.db(database);

      db.collection(collection)
        .find({ _id: new ObjectId(req.params.bookid) })
        .toArray()
        .then((data) => {
          res.json(data[0].likes);
        })
        .catch((error) => {
          res.status(401).json(error);
        });
    });
  }
);
bookroutes.post("/addcomments", (req, res) => {
  try {
    let body = req.body;
    const connectionString = process.env.CONNECTION_STRING;

    const database = process.env.DEFAULT_DATABASE;
    const collection = "Comments";

    const client = new MongoClient(connectionString);

    client.connect().then((connection) => {
      const db = connection.db(database);

      db.collection(collection)
        .insertOne(body)
        .then((data) => {
          res.json("comments added successfully");
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});
bookroutes.get(
  "/addcomments/:bookid",

  (req, res) => {
    const connectionString = process.env.CONNECTION_STRING;

    const database = process.env.DEFAULT_DATABASE;
    const collection = "Comments";

    const client = new MongoClient(connectionString);

    client.connect().then((connection) => {
      const db = connection.db(database);

      db.collection(collection)
        .find({ bookid: req.params.bookid })
        .toArray()
        .then((data) => {
          res.json(data);
        });
    });
  }
);
bookroutes.post("/addfriends", validatemiddleware, (req, res) => {
  let body = req.body;
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Friends";

  const client = new MongoClient(connectionString);

  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .insertOne(body)
      .then((data) => {
        res.json("friends added successfully");
      });
  });
});
bookroutes.get("/addfriends/:userid", validatemiddleware, (req, res) => {
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Friends";

  const client = new MongoClient(connectionString);

  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .find({ userid: req.params.userid })
      .toArray()
      .then((data) => {
        res.json(data);
      });
  });
});
bookroutes.get("/addbooks", validatemiddleware, (req, res) => {
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Bookrating";

  const client = new MongoClient(connectionString);

  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .find()
      .toArray()
      .then((data) => {
        res.json(data);
      });
  });
});

bookroutes.get("/addbooks/:userid", validatemiddleware, (req, res) => {
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Bookrating";

  const client = new MongoClient(connectionString);

  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .find({ userid: req.params.userid })
      .toArray()
      .then((data) => {
        res.json(data);
      });
  });
});
bookroutes.delete("/addbooks/:bookid/delete", (req, res) => {
  const connectionString = process.env.CONNECTION_STRING;

  const database = process.env.DEFAULT_DATABASE;
  const collection = "Bookrating";

  const client = new MongoClient(connectionString);

  client.connect().then((connection) => {
    const db = connection.db(database);

    db.collection(collection)
      .deleteOne({ _id: new ObjectId(req.params.bookid) })

      .then((data) => {
        res.json(data);
      });
  });
});
export default bookroutes;
