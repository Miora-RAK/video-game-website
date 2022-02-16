import express from "express";
import nunjucks from "nunjucks";
import apiCaller from "@fewlines-education/request";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "njk");

app.get("/", (request, response) => {
  apiCaller("http://videogame-api.fly.dev/platforms", (error, body) => {
    if (error) throw error;
    const plateform = JSON.parse(body);
    console.log(plateform);
    response.render("home", { plateformsAcces: plateform.platforms });
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
