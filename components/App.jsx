import React, { Component, Fragment, useState, useEffect, useRef } from 'react'
import Item from './Item';
console.log(process.env.COCKTAIL_KEY);
const App = (props) => {
  const mounted = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [drinks, setDrinks] = useState([])
  const [ingredients, setIngredients] = useState([]);
  const [displayed, setDisplayed] = useState([])
  const [using, setUsing] = useState([])
  const [alc, setAlc] = useState(false);
  const [nonAlc, setNonAlc] = useState(false);
  const [liqueur, setLiqueur] = useState(false);



  //attempting to make ingredient search a thing
  useEffect(() => {
    fetch(`https://www.thecocktaildb.com/api/json/v2/APIKEY/list.php?i=list`)
      .then(res => res.json())
      .then(result => {
        if (result.drinks === null) {
          setIngredients([]);
        } else {
          setIngredients(result.drinks);
        }
      });
  },[])
  
  const allPossibleCombos = list => {
    return list.reduce(
      (subsets, value) => subsets.concat(subsets.map(set => [value, ...set])),
      [[]]
    ).slice(1).map(set => parseUsing(set))
  }

  const AllDrinksWithIngredients = () => {
    let output = []
    let subsets = allPossibleCombos(using)

  }


  const handleChange = (field) => {
    return e => {
      let filtered = ingredients.filter(ing =>
        ing.strIngredient1.toLowerCase().includes(e.target.value)
      );
      if(e.target.value === ""){ filtered = [] }
      setSearchTerm(e.target.value);
      setDisplayed(filtered);

    }
  }






  const parseUsing = arr => {
    if(arr.length === 0) return ""
    return arr.map(el => el.split(" ").join("_")).join(",")
  }





  const fetchDrinks = arr => {
    if(arr.length === 0){
      setDrinks([])
    }else{
      fetch(`https://www.thecocktaildb.com/api/json/v2/APIKEY/filter.php?i=${parseUsing(arr)}`)
        .then(res => res.json())
        .then(result => {
          if (result.drinks !== "None Found") {
          setDrinks(result.drinks);
        }}
      );
    }
  }
  // const handleClick = event => {
  //   if(using.includes(event.target.textContent)){
  //     setUsing(using.filter(used => used !== event.target.textContent));
  //   }else{
  //     setUsing([...using, event.target.textContent])
  //   }
  // }
  const handleClick = field => {
    return e => {
      //Checks if or if not ingredient is in the Using list
      if(using.includes(e.target.textContent)){
        setUsing(using.filter(used => used !== event.target.textContent));
        //Since set___ is asynchronous I use prevUsing to mimic setUsing, in order to call
        //fetch the drinks without a step delay
        let prevUsing = parseUsing(using)
        //if prevUsing is only the length of the target context, then it means 
        //Using will go to [] on click, else the using list is shortened and the url is called again
        if(prevUsing.length === e.target.textContent){
          prevUsing = ""
          setDrinks([])
        }else{
          prevUsing = prevUsing.split(",").filter(el => el !== e.target.textContent).join(",")
          fetch(
            `https://www.thecocktaildb.com/api/json/v2/APIKEY/filter.php?i=${prevUsing}`
          )
            .then(res => res.json())
            .then(result => {
              if (result.drinks !== "None Found") {
                // debugger
                setDrinks(result.drinks);
              }
            });
        }
      }else{
        setUsing([...using, event.target.textContent]);
        let prevUsing = parseUsing(using);
        if (prevUsing.length === 0) {
          prevUsing = e.target.textContent;
        } else {
          prevUsing = prevUsing + "," + e.target.textContent;
        }
        fetch(
          `https://www.thecocktaildb.com/api/json/v2/APIKEY/filter.php?i=${prevUsing}`
        )
          .then(res => res.json())
          .then(result => {
            if (result.drinks !== "None Found") {
              setDrinks(result.drinks);
            }
          });
          
      }
    }
  }
  // debugger
  return (
    <MainArea>
      <SideBar>
        <input
          className="nav-search-input"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange("searchTerm")}
        />
        {displayed.map(drink => {
          return using.includes(drink.strIngredient1) ? (
            <p style={{ color: "red" }} onClick={handleClick("using")}>
              {drink.strIngredient1}
            </p>
          ) : (
            <p style={{ color: "black" }} onClick={handleClick("using")}>
              {drink.strIngredient1}
            </p>
          );
        })}
      </SideBar>
      <Content>
        <UsingContent>
          {using.map(used => (
            <p onClick={handleClick("using")} style={{ color: "red" }}>
              {used}
            </p>
          ))}
        </UsingContent>
        <DrinkSection>
          {drinks
            .filter(drink => drink.rank !== 0)
            .map(drink => (
              <Item using={using} key={drink.idDrink} drink={drink} />
            ))}
        </DrinkSection>
      </Content>
      <div style={{ float: "right" }}>
        {drinks.map(drink => (
          <Item using={using} key={drink.idDrink} drink={drink} />
        ))}
      </div>
      {selectedDrink && (
        <Item using={using} key={selectedDrink.idDrink} drink={selectedDrink} />
      )}
    </MainArea>
  );
}
export default App;