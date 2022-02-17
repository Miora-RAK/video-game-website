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
  // function getPlateformId(id: string): void {
  type Plateform = {
    id: string;
    name: string;
    slug: string;
    category: string;
    platforms: [];
    cover: [];
  };
  const idParameters = request.params;
  const idSelected = idParameters.idPlateform;
  apiCaller(`http://videogame-api.fly.dev/games/platforms/${idSelected}`, (error, body) => {
    if (error) {
      throw error;
    }
    const game = JSON.parse(body);
    console.log(game);
    const findNamePlateform = game.games.find((plateform: Plateform) => plateform.id === idSelected);
    if (findNamePlateform) {
      response.render("plateform-game", { gamesAccess: game.games, parameterValue: idSelected });
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
