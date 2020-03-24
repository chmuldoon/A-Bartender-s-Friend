
import React, { Component, Fragment, useState, useEffect, useRef } from "react";
import Item from "./Item";
import styled from "styled-components";
import UsingList from "./UsingList";
const App = props => {
  const mounted = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [drinks, setDrinks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [showSearch, setShowSearch] = useState(false)
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [using, setUsing] = useState(["Rum", "Gin", "Water", "Salt", "Ice", "Sugar", "Food Coloring", "Brandy"]);
  //attempting to make ingredient search a thing
  useEffect(() => {
    
    fetch(`https://www.thecocktaildb.com/api/json/v1/${1}/list.php?i=list`)
      .then(res => res.json())
      .then(result => {
        if (result.drinks === null) {
          setIngredients([]);
        } else {
          setIngredients(result.drinks);
        }
      });
    fetch(`https://www.thecocktaildb.com/api/json/v1/${1}/search.php?s=`)
      .then(res => res.json())
      .then(result => {
        if (result.drinks === null) {
          setDrinks([]);
        } else {
          result.drinks.forEach(drink => {
            let drinkIngredients = Object.values(drink)
              .slice(21, 36)
              .filter(ing => ing !== null)
              .map(ing =>
                ing.toLowerCase().includes("whisk") ? "Whiskey" : 
                ing.toLowerCase().includes("vodka") ? "Vodka" :
                ing
              );
            drink["ingredients"] = [... new Set(drinkIngredients)]
            
            // debugger
            drink["rank"] = compare(using, drink["ingredients"] )
          })
          setDrinks(
            result.drinks
              .filter(drink => drink.strAlcoholic === "Alcoholic")
              .sort((a, b) => b.rank - a.rank)
          );
        }
      });
  }, []);
  const compare = (l1,l2) =>{
    let count = 0
    l1 = l1.map( word => word.toLowerCase())
    l2 = l2.map(word => word.toLowerCase());

    l2.forEach(el => {
      if(l1.includes(el)){
        count += 1
      }
    })
    return count
  }
  const parseImg = str => {
    let input = str.toLowerCase().split(" ").join("%20") 
 
    
    return `https://www.thecocktaildb.com/images/ingredients/${input}-Small.png`
    
  }
  const allPossibleCombos = list => {
    return list
      .reduce(
        (subsets, value) => subsets.concat(subsets.map(set => [value, ...set])),
        [[]]
      )
      .slice(1)
      .map(set => parseUsing(set));
  };

  const handleChange = field => {
    return e => {
      let filtered = ingredients.filter(ing =>
        ing.strIngredient1.toLowerCase().includes(e.target.value.toLowerCase())
      );
      if (e.target.value === "") {
        filtered = [];
      }
      setSearchTerm(e.target.value);
      setDisplayed(filtered);
    };
  };

  const parseUsing = arr => {
    if (arr.length === 0) return "";
    return arr.map(el => el.split(" ").join("_")).join(",");
  };

  // const handleClick = event => {
  //   if(using.includes(event.target.textContent)){
  //     setUsing(using.filter(used => used !== event.target.textContent));
  //   }else{
  //     setUsing([...using, event.target.textContent])
  //   }
  // }

  const handleIngredients = () => {

  }
  const handleClick = field => {
    return e => {
      if (using.includes(e.target.textContent)) {
        setUsing(using.filter(used => used !== event.target.textContent));
        let prevUsing = using.filter(used => used !== event.target.textContent);

        if (prevUsing.length === 0) {
          setDrinks([]);
        } else {
          fetch(
            `https://www.thecocktaildb.com/api/json/v1/${1}/search.php?s=`
          )
            .then(res => res.json()).then(result => {
              result.drinks.forEach(drink => {
                let drinkIngredients = Object.values(drink)
                .slice(21, 36)
                .filter(ing => ing !== null)
                .map(ing =>
                ing.toLowerCase().includes("whisk") ? "Whiskey" : 
                ing.toLowerCase().includes("vodka") ? "Vodka" :
                ing
              );
            drink["ingredients"] = [... new Set(drinkIngredients)]
                  

                drink["rank"] = compare(prevUsing, drink["ingredients"]);
              });
              setDrinks(
                result.drinks
                  .filter(drink => drink.strAlcoholic === "Alcoholic")
                  .sort((a, b) => b.rank - a.rank)
              );
            });
         
        }
      } else {
        setUsing([...using, e.target.textContent]);
        // debugger
        setSearchTerm("")
        let prevUsing = [...using, e.target.textContent];
        // debugger
        fetch(`https://www.thecocktaildb.com/api/json/v1/${1}/search.php?s=`)
          .then(res => res.json())
          .then(result => {
              result.drinks.forEach(drink => {
                let drinkIngredients = Object.values(drink)
                  .slice(21, 36)
                  .filter(ing => ing !== null)
                  .map(ing =>
                    ing.toLowerCase().includes("whisk")
                      ? "Whiskey"
                      : ing.toLowerCase().includes("vodka")
                      ? "Vodka"
                      : ing
                  );
                drink["ingredients"] = [...new Set(drinkIngredients)];
                  

                drink["rank"] = compare(prevUsing, drink["ingredients"]);
              });
              setDrinks(
                result.drinks
                  .filter(drink => drink.strAlcoholic === "Alcoholic")
                  .sort((a, b) => b.rank - a.rank)
              );
          });
        
      }
    };
  };
  return (
    <Fragment>
      <div className="topBar">
        <div className="barLeft">
          <span className="hide-sm">
            {showSearch && (
              <input
                className="searchInput"
                type="text"
                placeholder="Search for Ingredients"
                value={searchTerm}
                onChange={handleChange("searchTerm")}
              />
            )}
          </span>
          <span className="hide-sm">
            <i
              onClick={() => setShowSearch(!showSearch)}
              style={{ cursor: "pointer" }}
              className="fas fa-search"
            ></i>
          </span>

          <span className="show-sm">
            <i class="fas fa-cocktail"></i>
          </span>
        </div>
        <span className="hide-sm">
          <div className="barCenter">A Bartender's Friend</div>
        </span>
        <span className="show-sm">
          <input
            className="searchInput"
            type="text"
            placeholder="Search for Ingredients"
            value={searchTerm}
            onChange={handleChange("searchTerm")}
          />
        </span>

        <div className="barRight">
          <i className="fas fa-bars"></i>
        </div>
      </div>
      <span className="show-sm">
        <div className="sideBar">
          {displayed.map(drink => {
            return (
              <Fragment>
                {using.includes(drink.strIngredient1) ? (
                  <div className="checkedSearchItem" onClick={handleClick("using")}>
                    <img src={parseImg(drink.strIngredient1)} />
                    <p>
                      {drink.strIngredient1.length > 22
                        ? drink.strIngredient1.slice(0, 22)
                        : drink.strIngredient1}
                    </p>
                  </div>
                ) : (
                  <div className="searchItem" onClick={handleClick("using")}>
                    <img src={parseImg(drink.strIngredient1)} />
                    <p>
                      {drink.strIngredient1.length > 22
                        ? drink.strIngredient1.slice(0, 22)
                        : drink.strIngredient1}
                    </p>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </span>
      <div className="mainArea">
        {showSearch && (
          <div className="sideBar">
            {displayed.map(drink => {
              return (
                <Fragment>
                  {using.includes(drink.strIngredient1) ? (
                    <div className="checkedSearchItem">
                      <img src={parseImg(drink.strIngredient1)} />
                      <p onClick={handleClick("using")}>
                        {drink.strIngredient1.length > 22
                          ? drink.strIngredient1.slice(0, 22)
                          : drink.strIngredient1}
                      </p>
                    </div>
                  ) : (
                    <div className="searchItem">
                      <img src={parseImg(drink.strIngredient1)} />
                      <p onClick={handleClick("using")}>
                        {drink.strIngredient1.length > 22
                          ? drink.strIngredient1.slice(0, 22)
                          : drink.strIngredient1}
                      </p>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        )}
        <div className="content">
          <UsingContent>
            <div style={{ width: "100%" }}>
              <p>Your virtual shelf is stocked with:</p>
            </div>
            {using.map(used => (
              <div
                className="ingItem"
                onClick={handleClick("using")}
                style={{
                  backgroundColor: "#4CA64C",
                  color: "white",
                  minWidth: "50px"
                }}
              >
                {used}
              </div>
            ))}
          </UsingContent>
          <div className="drinkSection">
            {drinks
              .filter(drink => drink.rank !== 0)
              .map(drink => (
                <Item using={using} key={drink.idDrink} drink={drink} />
              ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};


export const UsingContent = styled.div`
  width: 80%;
  min-height: 5%;
  margin-bottom: 2%;
  display: flex;
  justify-content: center;

  flex-wrap: wrap;
  > div {
    display: flex;
    justify-content: center;
    color: white;
  }
`;


export default App;
