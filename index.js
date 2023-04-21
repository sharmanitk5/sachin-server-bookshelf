import express from "express";
import bookroutes from "./books.js";
import cors from "cors";
import dotenv from "dotenv";
import mongo from "mongodb";
import { upload } from "./grid-fs.util.js";
dotenv.config();
const app = express();

var bucket;

async function createGridStream() {
  return new Promise((resolve, reject) => {
    new mongo.MongoClient(process.env.CONNECTION_STRING)
      .connect()
      .then((client) => {
        const db = client.db(process.env.DEFAULT_DATABASE);
        resolve(new mongo.GridFSBucket(db, { bucketName: "uploads" }));
      })
      .catch((e) => {
        reject(e);
      });
  });
}
app.use(cors());
app.use(express.json());

app.use("/", bookroutes);
app.post("/app-image-upload", upload.single("myFile"), (req, res) => {
  res.json(req.file);
});

app.get("/image/:filename", (req, res) => {
  bucket
    .find({ filename: req.params.filename })
    .toArray()
    .then((files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      }

      const stream = bucket.openDownloadStreamByName(req.params.filename);
      stream.pipe(res);
    });
});

app.get("/", (req, res) => {
  res.json("Hello");
});
createGridStream().then((x) => {
  bucket = x;

  app.listen(3001, () => {
    console.log("Server started");
  });
});
