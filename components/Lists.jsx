import React, { Component, Fragment } from 'react'
import Item from './Item';
export class Lists extends Component {
  constructor(props){
    super(props)
    this.state = {
      searchTerm: "",
      drinks: [],
      ingredients: [],
      displayed: [],
      using: [],
      selectedDrink: null
    }
  }
  componentDidMount(){
    let that = this;
    fetch(`https://www.thecocktaildb.com/api/json/v2/APIKEY/list.php?i=list`)
      .then(res => res.json())
      .then(result => {
        if (result.drinks === null) {
          that.setState({ ingredients: [] });
          
        } else {
          that.setState({ingredients: result.drinks});
        }
      });
  }
  update(field) {
    return e => {
      let filtered = this.state.ingredients.filter(ing =>
        ing.strIngredient1.toLowerCase().includes(e.target.value)
      );
      if (e.target.value === '') { filtered = []};
      this.setState({ [field]: e.target.value, displayed: filtered })
    }
  }
  
  handleSelect(field){
    let that = this
    return e => {
      let id = e.target.outerHTML.slice(12, 17);
      let url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
      fetch(url)
        .then(res => res.json())
        .then(result => {
          if (result.drinks !== "None Found") {
            that.setState({ selectedDrink: result.drinks });
          }
        });
    }
  }
  parseUsing(arr) {
    if(arr.length === 0) return ""
    return arr.map(el => el.split(" ").join("_")).join(",")
  }
  handleClick(field) {
    let that = this;
    return e => {
      if(this.state.using.includes(e.target.textContent)){
        this.setState({[field]: this.state.using.filter(used => used !== e.target.textContent)})
        let prevUsing = that.parseUsing(that.state.using)
        if (prevUsing.length === e.target.textContent.length) {
          prevUsing = ""
          that.setState({ drinks: [] });
        } else {
          prevUsing = prevUsing.split(",").filter(el => el !== e.target.textContent).join(",")
          fetch(
            `https://www.thecocktaildb.com/api/json/v2/APIKEY/filter.php?i=${prevUsing}`
          )
            .then(res => res.json())
            .then(result => {
              if (result.drinks !== "None Found") {
                that.setState({ drinks: result.drinks });
              }
            });
        }
      }else{
        this.setState({[field]: [...this.state.using, e.target.textContent]})
        let prevUsing = that.parseUsing(that.state.using)
        if (prevUsing.length === 0) {
          prevUsing = e.target.textContent;
        } else {
          prevUsing = prevUsing + "," + e.target.textContent;
        }
        fetch(
          `https://www.thecocktaildb.com/api/json/v2/APIKEY/filter.php?i=${
            prevUsing
          }`
        )
          .then(res => res.json())
          .then(result => {
            if (result.drinks !== "None Found") {
              that.setState({ drinks: result.drinks });
            }
          });
      }
    }

  }

  render() {
    let {searchTerm, displayed, using, drinks} = this.state
    return (
      <div style={{ display: "flex" }}>
        <div style={{ float: "left" }}>
          <input
            className="nav-search-input"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={this.update("searchTerm")}
          />
          {using.map(used => (
            <p onClick={this.handleClick("using")} style={{ color: "red" }}>
              {used}
            </p>
          ))}
          {displayed.map(drink => {
            return using.includes(drink.strIngredient1) ? (
              <p style={{ color: "red" }} onClick={this.handleClick("using")}>
                {drink.strIngredient1}
              </p>
            ) : (
              <p style={{ color: "black" }} onClick={this.handleClick("using")}>
                {drink.strIngredient1}
              </p>
            );
          })}
        </div>
        <div style={{ float: "right" }}>
          {drinks.map(drink => (
            // <Item onClick={this.handleSelect("selectedDrink")} key={drink.strIngredient1} drink={drink} />
            <div
              onClick={this.handleSelect("selectedDrink")}
              drink={drink.idDrink}
            >
              <h1>{drink.strDrink}</h1>
              <img
                src={drink.strDrinkThumb}
                style={{ maxHeight: "50px" }}
                alt=""
              />
            </div>
          ))}
        </div>
        {this.state.selectedDrink && <Item key={this.state.selectedDrink.idDrink} drink={this.state.selectedDrink} />}
      </div>
    );
  }
}

export default Lists
