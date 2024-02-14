import React from "react";

const CategorySummary = ({ category, data }) => {
  const { totalCalories, totalProteins, totalCarbs, totalFats } = data;

  return (
    <div className="fl-md--container">
      <div className="fl-md__intro">
        <div></div>
        <p className="bold">{category}</p>
      </div>
      <div className="fl-md--nutrients">
        <div className="fl-md__nutrients">
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Calories</p>

            <p className="fl-md__value">{totalCalories}cal</p>
          </div>
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Proteins</p>

            <p className="fl-md__value">{totalProteins}g</p>
          </div>
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Carbs</p>

            <p className="fl-md__value">{totalCarbs}g</p>
          </div>
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Fats</p>

            <p className="fl-md__value">{totalFats}g</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySummary;
