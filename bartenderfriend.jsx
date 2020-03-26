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
// result.drinks.map(drink => {
//   ({
//     name: drink.strDrink,
//     alcoholic: drink.strAlcoholic !== "Non alcoholic",
//     liqueur: drink.strCategory.toLowerCase().includes("liqueur"),
//     category: drink.strCategory,
//     instructions: drink.strInstructions,
//     glass: drink.strGlass,
//     ingredients: Object.values(drink).slice(21, 36),
//     measurements: Object.values(drink).slice(36, 51),
//     using: [... new Set(Object.values(drink).slice(21, 36).filter(val => val !== null && val !== ""))],
//     photo: drink.strDrinkThumb
//   });
// })
