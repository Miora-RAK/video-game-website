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

/* ------ HOME  ------- */
app.get("/", (request, response) => {
  response.render("home");
});
/* ------ HOME END  ------- */

/* ------ PLATEFORMS  ------- */
app.get("/platforms", (request, response) => {
  const pageParameters = request.query.page?.toString();
  if (typeof pageParameters === "string" && parseInt(pageParameters) > 1) {
    console.log(`http://videogame-api.fly.dev/platforms?page=${pageParameters}`);
    apiCaller(`http://videogame-api.fly.dev/platforms?page=${pageParameters}`, (error, body) => {
      if (error) {
        throw error;
      }
      const page = JSON.parse(body);
      return response.render("platforms", {
        plateformsAccess: page.platforms,
        parameterValue: pageParameters,
      });
    });
  } else {
    apiCaller(`http://videogame-api.fly.dev/platforms`, (error, body) => {
      if (error) {
        throw error;
      }
      const plateform = JSON.parse(body);
      response.render("platforms", { plateformsAccess: plateform.platforms });
    });
  }
});

/* ------ PLATEFORMS END  ------- */

/* ------ GAME-LIST  ------- */
app.get("/:idPlateform", (request, response) => {
  const idParameters = request.params;
  const idSelected = idParameters.idPlateform;
  console.log(31, request.query);
  const pageParameters = request.query.page?.toString();
  console.log(33, pageParameters);
  if (typeof pageParameters === "string" && parseInt(pageParameters) > 1) {
    apiCaller(`http://videogame-api.fly.dev/games/platforms/${idSelected}?page=${pageParameters}`, (error, body) => {
      if (error) {
        throw error;
      }
      const page = JSON.parse(body);
      return response.render("plateform-game", {
        gamesAccess: page.games,
        parameterValue: pageParameters,
        idParameterValue: idSelected,
      });
    });
  } else {
    apiCaller(`http://videogame-api.fly.dev/games/platforms/${idSelected}`, (error, body) => {
      if (error) {
        throw error;
      }
      const game = JSON.parse(body);
      response.render("plateform-game", {
        gamesAccess: game.games,
        idParameterValue: idSelected,
        parameterValue: pageParameters,
      });
    });
  }
});

/* ------ GAME-LIST END ------- */

/* ------ GAME DETAILS  ------- */
app.get("/:idPlateform/:slugGame", (request, response) => {
  const slugParameters = request.params;
  const slugSelected = slugParameters.idPlateform;
  apiCaller(`http://videogame-api.fly.dev/games/${slugSelected}`, (error, body) => {
    if (error) {
      throw error;
    }
    const gameDetails = JSON.parse(body);
    response.render("game-details", { detailsGame: gameDetails.screenshots, parameterValue: slugSelected });
  });
});
/* ------ GAME-DETAILS END  ------- */

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
