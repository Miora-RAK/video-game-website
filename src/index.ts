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

/* ------ PLATEFORMS  ------- */
app.get("/", (request, response) => {
  apiCaller(`http://videogame-api.fly.dev/platforms`, (error, body) => {
    if (error) {
      throw error;
    }
    const plateform = JSON.parse(body);
    response.render("home", { plateformsAccess: plateform.platforms });
  });
});
/* ------ PLATEFORMS END  ------- */

/* ------ GAME-LIST  ------- */
app.get("/:idPlateform", (request, response) => {
  const idParameters = request.params;
  const idSelected = idParameters.idPlateform;
  console.log(31, request.query);
  const pageParameters = request.query.page?.toString();
  console.log(33, pageParameters);
  if (pageParameters === "string" && parseInt(pageParameters) > 1) {
    apiCaller(
      `http://videogame-api.fly.dev/games/plateforms/${idSelected}?page=${parseInt(pageParameters)}`,
      (error, body) => {
        if (error) {
          throw error;
        }
        const page = JSON.parse(body);
        return response.render("plateform-game", {
          pageAccess: page.games,
          parameterValue: pageParameters,
          idParameterValue: idSelected,
        });
      },
    );
  } else {
    apiCaller(`http://videogame-api.fly.dev/games/platforms/${idSelected}`, (error, body) => {
      if (error) {
        throw error;
      }
      const game = JSON.parse(body);
      response.render("plateform-game", { gamesAccess: game.games, parameterValue: idSelected });
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
