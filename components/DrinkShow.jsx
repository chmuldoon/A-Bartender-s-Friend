import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
const DrinkShow = ({drink, using}) => {

  const renderIngredients = drink => {
    return measurementAndIngredient().map(ing => {
      return (
        <div className="ingredientItem" style={{margin: "0"}}>
          {ing[1] ? (
            <Fragment>
              <div
                className="box arrow-right"
                style={{ backgroundColor: "#4CA64C" }}
              ></div>

              <div
                className="ingredientName"
                style={{ backgroundColor: "grey", color: "white" }}
              >
                {ing[0].toLowerCase()}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="box"></div>
              <div className="ingredientName"> {ing[0].toLowerCase()}</div>
            </Fragment>
          )}
        </div>
      );
    });
  }
  const measurementAndIngredient = () => {
    let adjustedProps = using.map(word => word.toLowerCase());

    return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(idx => {
      if(drink.ingredients[idx] === null){
        return null
      }else{
        if(adjustedProps.includes(drink.ingredients[idx].toLowerCase())){
          if (drink.measurements[idx] === null) {
            return [`some ${drink.ingredients[idx]}`, true];
          } else {
            return [`${drink.measurements[idx]}${drink.ingredients[idx]}`, true];
          }
        }else{
          if(drink.measurements[idx] === null){
            return [`some ${drink.ingredients[idx]}`, false]
          }else{
            return [`${drink.measurements[idx]}${drink.ingredients[idx]}`, false]
          }
        }
      }
    }).filter(item => item !==  null)
  }
  debugger
  return (
    <div>
      <div className="drinkShowTitle">{drink.name}</div>
      <div className="drinkShow">
        <div>
          <img
            src={`https://www.thecocktaildb.com/images/media/drink/${drink.photo}`}
          />
        </div>
        <div>
          <div style={{ height: "100%", width: "100%" }}>
            <h1>Ingredients</h1>
            {renderIngredients(drink)}
          </div>
        </div>
        <div style={{ padding: "0 10px 0 10px" }}>
          <h1>Instructions</h1>
          {drink.instructions}
        </div>
      </div>
    </div>
  );
}

DrinkShow.propTypes = {
  drink: PropTypes.object.isRequired
}

export default DrinkShow

