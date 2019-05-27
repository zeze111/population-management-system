import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import routes from "./routes";

const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1", routes);

const port = parseInt(process.env.PORT, 10) || 8000;
app.set("port", port);

app.listen(port, () => {
  console.log(`App started on Port: ${port}`);
});

export default app;
