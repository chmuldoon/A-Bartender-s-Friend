
import React, { Component, Fragment, useState, useEffect, useRef } from "react";
import Item from "./Item";
import styled from "styled-components";
import UsingList from "./UsingList";
import DrinkShow from "./DrinkShow";
const App = props => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drinks, setDrinks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [showSearch, setShowSearch] = useState(false)
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [displayModal, toggleModal] = useState(false);
  const [searchType, setSearchType] = useState("ingredients");



  const [using, setUsing] = useState([
    "Rum", 
    "Gin", 
    "Water", 
    "Salt", 
    "Ice", 
    "Sugar", 
    "Food Coloring",
     "Brandy", 
     "Orange Juice", 
     "Orange",
     "Tonic Water",
     "Club Soda",
     "Vodka"
    ]);
  //attempting to make ingredient search a thing
  useEffect(() => {
    setIngredients(props.ing);
    
    let baseDrinks = Object.values(props.coc)
      .filter(drink => drink.liqueur !== true && drink.alcoholic)
    baseDrinks.forEach(drink => {
      drink["rank"] = compare(using, drink["using"]);

    })
    // debugger
    setDrinks(
      baseDrinks.sort((a, b) => b.rank - a.rank));
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
    debugger
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
      if(searchType === "ingredients"){
        let filtered = ingredients.filter(ing =>
          ing
            .split(" ")
            .some(part =>
              part.toLowerCase().startsWith(e.target.value.toLowerCase())
            )
        );
        if (e.target.value === "") {
          filtered = [];
        }
        setSearchTerm(e.target.value);
        setDisplayed(filtered);
      }else{
        debugger
        let filtered = Object.values(props.coc).filter(
          drink => drink.liqueur !== true && drink.alcoholic
        ).filter(drink => drink.name.split(" ").some(part => 
          part.toLowerCase().startsWith(e.target.value.toLowerCase())))
        if (e.target.value === "") {
          filtered = [];
        }
        debugger
        setSearchTerm(e.target.value);
        setDisplayed(filtered);
    }};
  };

  const parseUsing = arr => {
    if (arr.length === 0) return "";
    return arr.map(el => el.split(" ").join("_")).join(",");
  };

  
  const handleClick = field => {
    return e => {
      debugger
      if (using.map(used => used.toLowerCase()).includes(e.target.textContent.toLowerCase().trim())) {
        setUsing(
          using.filter(
            used =>
              used.toLowerCase().trim() !==
              event.target.textContent.toLowerCase().trim()
          )
        );
        let prevUsing = using.filter(used => used !== event.target.textContent);
        let baseDrinks = Object.values(props.coc).filter(
          drink => drink.liqueur !== true && drink.alcoholic
        );
        baseDrinks.forEach(drink => {
          drink["rank"] = compare(prevUsing, drink["using"])
        })
        setDrinks(baseDrinks.sort((a, b) => b.rank - a.rank))
      } else {
        setUsing([...using, e.target.textContent]);
        setSearchTerm("")
        let prevUsing = [...using, e.target.textContent];
        let baseDrinks = Object.values(props.coc).filter(
          drink => drink.liqueur !== true && drink.alcoholic
        );
        baseDrinks.forEach(drink => {
          drink["rank"] = compare(prevUsing, drink["using"]);
        });
        setDrinks(baseDrinks.sort((a, b) => b.rank - a.rank));
        
      }
    };
  };
  return (
    <Fragment>
      <div className="topBar">
        <div className="barLeft">
          <span className="hide-sm">
            {showSearch && (
              <div>
                <input
                  className="searchInput"
                  type="text"
                  placeholder={`Search for ${searchType}`}
                  value={searchTerm}
                  onChange={handleChange("searchTerm")}
                />
                <div className="searchType">
                  {searchType === "drinks" ? (
                    <div
                      className="searchTypeLeft"
                      style={{
                        backgroundColor: "#4CA64C"
                      }}
                    >
                      Drinks
                    </div>
                  ) : (
                    <div
                      className="searchTypeLeft"
                      onClick={() => {
                        setSearchType("drinks");
                        setSearchTerm("");
                        setDisplayed([]);
                      }}
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        padding: "1px #4CA64C"
                      }}
                    >
                      Drinks
                    </div>
                  )}
                  {searchType === "ingredients" ? (
                    <div
                      className="searchTypeRight"
                      style={{
                        backgroundColor: "#4CA64C",
                        fontSize: "12px",
                        fontWeight: "400"
                      }}
                    >
                      Ingredients
                    </div>
                  ) : (
                    <div
                      className="searchTypeRight"
                      onClick={() => {
                        setSearchType("ingredients");
                        setSearchTerm("");
                        setDisplayed([]);
                      }}
                      style={{
                        backgroundColor: "white",
                        color: "black",

                        fontSize: "12px",
                        fontWeight: "400"
                      }}
                    >
                      Ingredients
                    </div>
                  )}
                </div>
              </div>
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
            <i
              class="fas fa-cocktail"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSearchTerm("");
                setDisplayed([]);
              }}
            ></i>
          </span>
        </div>
        <span className="hide-sm">
          <div className="barCenter">A Bartender's Friend</div>
        </span>
        <span className="show-sm">
          <div>
            <input
              className="searchInput"
              type="text"
              placeholder={`Search for ${searchType}`}
              value={searchTerm}
              onChange={handleChange("searchTerm")}
            />
            <i
              class="fas fa-times"
              onClick={() => {
                setSearchTerm("");
                setDisplayed([]);
              }}
              style={{
                marginTop: "10px",
                color: "white",
                cursor: "pointer",
                float: "right"
              }}
            ></i>
          </div>
          <div>
            <div className="searchType">
              {searchType === "drinks" ? (
                <div
                  className="searchTypeLeft"
                  style={{
                    backgroundColor: "#4CA64C"
                  }}
                >
                  Drinks
                </div>
              ) : (
                <div
                  className="searchTypeLeft"
                  onClick={() => {
                    setSearchType("drinks");
                    setSearchTerm("");
                    setDisplayed([]);
                  }}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    padding: "1px #4CA64C"
                  }}
                >
                  Drinks
                </div>
              )}
              {searchType === "ingredients" ? (
                <div
                  className="searchTypeRight"
                  style={{
                    backgroundColor: "#4CA64C",
                    fontSize: "12px",
                    fontWeight: "400"
                  }}
                >
                  Ingredients
                </div>
              ) : (
                <div
                  className="searchTypeRight"
                  onClick={() => {
                    setSearchType("ingredients");
                    setSearchTerm("");
                    setDisplayed([]);
                  }}
                  style={{
                    backgroundColor: "white",
                    color: "black",

                    fontSize: "12px",
                    fontWeight: "400"
                  }}
                >
                  Ingredients
                </div>
              )}
            </div>
          </div>
        </span>

        <div className="barRight">{/* <i className="fas fa-bars"></i> */}</div>
      </div>
      <span className="show-sm">
        <div className="sideBar">
          {searchType === "drinks" &&
            displayed.map(drink => {
              return (
                <Fragment>
                  <div
                    className="searchItem"
                    onClick={() => {
                      toggleModal(!displayModal);
                      setSelectedDrink(drink);
                    }}
                  >
                    <img
                      src={`https://www.thecocktaildb.com/images/media/drink/${drink.photo}`}
                    />
                    <p>{drink.name}</p>
                  </div>
                </Fragment>
              );
            })}
          {searchType === "ingredients" &&
            displayed.map(ing => {
              return (
                <Fragment>
                  {using.includes(ing) ? (
                    <div
                      className="checkedSearchItem"
                      onClick={handleClick("using")}
                    >
                      <img src={parseImg(ing)} />
                      <p>{ing.length > 22 ? ing.slice(0, 22) : ing}</p>
                    </div>
                  ) : (
                    <div className="searchItem" onClick={handleClick("using")}>
                      <img src={parseImg(ing)} />
                      <p>{ing.length > 22 ? ing.slice(0, 22) : ing}</p>
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
            {searchType === "drinks" &&
              displayed.map(drink => {
                return (
                  <Fragment>
                    <div
                      className="searchItem"
                      onClick={() => {
                        toggleModal(!displayModal);
                        setSelectedDrink(drink);
                      }}
                    >
                      <img
                        src={`https://www.thecocktaildb.com/images/media/drink/${drink.photo}`}
                      />
                      <p>{drink.name}</p>
                    </div>
                  </Fragment>
                );
              })}
            {searchType === "ingredients" &&
              displayed.map(ing => {
                return (
                  <Fragment>
                    {using.includes(ing) ? (
                      <div
                        className="checkedSearchItem"
                        onClick={handleClick("using")}
                      >
                        <img src={parseImg(ing)} />
                        <p>{ing.length > 22 ? ing.slice(0, 22) : ing}</p>
                      </div>
                    ) : (
                      <div
                        className="searchItem"
                        onClick={handleClick("using")}
                      >
                        <img src={parseImg(ing)} />
                        <p>{ing.length > 22 ? ing.slice(0, 22) : ing}</p>
                      </div>
                    )}
                  </Fragment>
                );
              })}
          </div>
        )}
        <div className="content">
          <div className="usingContent">
            <div style={{ width: "100%" }}>
              <p>Your virtual shelf is stocked with:</p>
            </div>
            {using.map(used => (
              <div
                className="ingItem"
                onClick={handleClick("using")}
                style={{
                  color: "white",
                  minWidth: "50px"
                }}
              >
                {`${used} `}
                <i
                  class="fas fa-times"
                  style={{
                    color: "white",
                    marginLeft: "5px",
                    marginTop: "1px"
                  }}
                ></i>
              </div>
            ))}
          </div>
          <div className="drinkSection">
            {drinks
              .filter(drink => drink.rank > 1)
              .map(drink => (
                <div
                  onClick={() => {
                    toggleModal(!displayModal);
                    setSelectedDrink(drink);
                  }}
                >
                  <Item using={using} key={drink.name} drink={drink} />
                </div>
              ))}
          </div>
        </div>
      </div>
      {displayModal && (
        <div
          className="modal-background"
          onClick={() => {
            toggleModal(!displayModal);
            setSelectedDrink(null);
          }}
        >
          <div
            className="modal-child"
            style={{ display: "flex" }}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <div className="modal-case">
              <div className="Xcase">
                <i
                  class="fas fa-times"
                  style={{
                    fontSize: "30px",
                    color: "white",
                    cursor: "pointer",
                    marginBottom: "10px"
                  }}
                  onClick={() => {
                    toggleModal(!displayModal);
                    setSelectedDrink(null);
                  }}
                ></i>
              </div>

              <DrinkShow using={using} drink={selectedDrink} />
            </div>
          </div>
        </div>
      )}
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
