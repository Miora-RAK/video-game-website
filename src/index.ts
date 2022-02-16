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
    if (error) {
      throw error;
    }
    const plateform = JSON.parse(body);
    response.render("home", { plateformsAcces: plateform.platforms });
  });
});

app.get("/plateform", (request, response) => {
  apiCaller(`http://videogame-api.fly.dev/games/platforms/19c9dcae-80a2-e137-50ff-11b823738827`, (error, body) => {
    if (error) {
      throw error;
    }
    const game = JSON.parse(body);
    console.log(game);
    response.render("plateform-game.njk", { gameAcces: game.games });
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
