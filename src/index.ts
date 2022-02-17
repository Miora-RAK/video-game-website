import express from "express";
import nunjucks from "nunjucks";
import apiCaller from "@fewlines-education/request";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "njk");

app.use(express.static("public"));

app.get("/", (request, response) => {
  apiCaller("http://videogame-api.fly.dev/platforms", (error, body) => {
    if (error) {
      throw error;
    }
    const plateform = JSON.parse(body);
    response.render("home", { plateformsAccess: plateform.platforms });
  });
});

app.get("/:idPlateform", (request, response) => {
  const idParameters = request.params;
  const idSelected = idParameters.idPlateform;
  apiCaller(`http://videogame-api.fly.dev/games/platforms/${idSelected}`, (error, body) => {
    if (error) {
      throw error;
    }
    const game = JSON.parse(body);
    response.render("plateform-game", { gamesAccess: game.games, parameterValue: idSelected });
  });
});

app.get("/:idPlateform/:slugGame", (request, response) => {
  const slugParameters = request.params;
  const slugSelected = slugParameters.idPlateform;
  apiCaller(`http://videogame-api.fly.dev/games/${slugSelected}`, (error, body) => {
    if (error) {
      throw error;
    }
    const gameDetails = JSON.parse(body);
    console.log(gameDetails);
    response.render("game-details", { detailsGame: gameDetails.screenshots, parameterValue: slugSelected });
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
