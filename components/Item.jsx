import React, { Component, Fragment } from "react";
import styled from "styled-components";
class Item extends Component {
  constructor(props) {
    super(props);
    // this.state = { drink: null, error: null, isLoaded: false };
    // this.ingredientList = this.ingredientList.bind(this)
  }
  renderIngredients(drink){
    let adjustedProps = this.props.using.map(word => word.toLowerCase())
    return (
      <IngredientsSection>
        {drink.ingredients.map(ing => {
          return adjustedProps.includes(
              ing.toLowerCase()
            ) ? (
              <div
                className="ingItem"
                style={{ backgroundColor: "#4CA64C" }}
              >{ing}</div>
            ) : (
              <div
                className="ingItem"
                style={{ backgroundColor: "#ff6666" }}
              >{ing}</div>
            )

        })}
      </IngredientsSection>
    );
  }

  render() {
    if (!this.props.drink) {
      return null;
    }
    let{drink, using} = this.props;
    debugger
    return (
      <DrinkCard>
        <div>
          {/* <p>{drink.strCategory}</p> */}
          <img
            src={drink.strDrinkThumb}
            style={{ width: "100%", marginBottom: "10px" }}
            alt=""
          />
          <p className="drinkTitle" style={{ width: "100%", textAlign: "center" }}>{drink.strDrink}</p>
        </div>
        {this.renderIngredients(drink)}
      </DrinkCard>
    );
  }
}
export const IngredientsSection = styled.div`
  display: grid;
  grid-template-columns: 100px 100px;
  grid-template-rows: 40px 40px 40px 40px 40px;

`
export const DrinkCard = styled.div`
width: 260px;
height: 530px;
// border: 1px solid black;
display: flex;
flex-wrap: wrap;
justify-content: center;
margin-left: 20px;
margin-bottom: 20px;
background-color: white;
  .drinkTitle {
    font-family: "Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 1.233333rem;
    font-weight: 500;
    padding: 0, 10px, 0, 10px;
  }




`
export default Item;
