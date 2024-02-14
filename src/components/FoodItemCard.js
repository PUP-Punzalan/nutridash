import React from "react";

const FoodItemCard = ({ food }) => {
  return (
    <div className="fl-lg--wrapper">
      <div className="fl-lg__header">
        <div className="fl-lg__header__section">
          <h5>{food.name}</h5>
          <p className={"ft-lg ft-" + food.type}>{food.type}</p>
        </div>
        <div className="fl-lg__header__section">
          <p>
            {food.value} {food.unit}
          </p>
        </div>
      </div>

      <div className="fl-lg__nutrients">
        <div className="fl-lg__nutrients__macro">
          <p className="h7">Calories</p>
          <p className="fl-lg__nutrients__value">{food.calories}cal</p>
        </div>
        <div className="fl-lg__nutrients__macro">
          <p className="h7">Proteins</p>
          <p className="fl-lg__nutrients__value">{food.proteins}g</p>
        </div>
        <div className="fl-lg__nutrients__macro">
          <p className="h7">Carbs</p>
          <p className="fl-lg__nutrients__value">{food.carbs}g</p>
        </div>
        <div className="fl-lg__nutrients__macro">
          <p className="h7">Fats</p>
          <p className="fl-lg__nutrients__value">{food.fats}g</p>
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
