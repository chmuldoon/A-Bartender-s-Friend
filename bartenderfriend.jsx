import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App2";
import Lists from "./components/Lists";
import { ingredientsNameList, StaticCocktails } from "./staticDB";
document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <App ing={ingredientsNameList} coc={StaticCocktails} />,
    document.getElementById("main")
  );
});
