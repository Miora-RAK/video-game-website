import express from "express";
import nunjucks from "nunjucks";
import fetch from "node-fetch";

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
    fetch(`http://videogame-api.fly.dev/platforms?page=${pageParameters}`)
      .then((response) => response.json())
      .then((page) => {
        return response.render("platforms", {
          plateformsAccess: page.platforms,
          parameterValue: pageParameters,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    fetch(`http://videogame-api.fly.dev/platforms`)
      .then((response) => response.json())
      .then((plateform) => {
        return response.render("platforms", { plateformsAccess: plateform.platforms });
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

/* ------ PLATEFORMS END  ------- */

/* ------ GAME-LIST  ------- */
app.get("/:idPlateform", (request, response) => {
  const idParameters = request.params;
  const idSelected = idParameters.idPlateform;
  console.log(58, request.query);
  const pageParameters = request.query.page?.toString();
  console.log(60, pageParameters);
  if (typeof pageParameters === "string" && parseInt(pageParameters) > 1) {
    fetch(`http://videogame-api.fly.dev/games/platforms/${idSelected}?page=${pageParameters}`)
      .then((response) => response.json())
      .then((page) => {
        return response.render("plateform-game", {
          gamesAccess: page.games,
          parameterValue: pageParameters,
          idParameterValue: idSelected,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    fetch(`http://videogame-api.fly.dev/games/platforms/${idSelected}`)
      .then((response) => response.json())
      .then((game) => {
        return response.render("plateform-game", {
          gamesAccess: game.games,
          idParameterValue: idSelected,
          parameterValue: pageParameters,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
/* ------ GAME-LIST END ------- */

/* ------ GAME DETAILS  ------- */
app.get("/:idPlateform/:slugGame", (request, response) => {
  const slugParameters = request.params;
  const slugSelected = slugParameters.idPlateform;
  fetch(`http://videogame-api.fly.dev/games/${slugSelected}`)
    .then((response) => response.json())
    .then((result) => {
      return response.render("game-details", { detailsGame: result.screenshots, parameterValue: slugSelected });
    })
    .catch((error) => {
      console.error(error);
    });
});

/* ------ GAME-DETAILS END  ------- */

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
