import React from "react";
import supabase from "../config/SupabaseClient";

const FoodItemCardAddList = ({ food, date, category, user }) => {
  const handleRemoveFood = async () => {
    try {
      const { data, error } = await supabase
        .from("dailyMeals")
        .delete()
        .eq("id", food.id);

      if (error) {
        throw error;
      }
      window.location.reload();
    } catch (error) {
      console.log("Error removing food: ", error.message);
    }
  };

  return (
    <div className="fl-md--container">
      <div className="fl-md__intro">
        <div className="fl-md__intro__section">
          {food.foodItem.value} {food.foodItem.unit}
        </div>
        <div className="">
          <p className="bold">{food.foodItem.name}</p>
          <p className={"ft-md ft-" + food.foodItem.type}>
            {food.foodItem.type}
          </p>
        </div>
      </div>
      <div className="fl-md--nutrients">
        <div className="fl-md__nutrients">
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Calories</p>
            <p className="fl-md__value">{food.foodItem.calories}cal</p>
          </div>
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Proteins</p>

            <p className="fl-md__value">{food.foodItem.proteins}g</p>
          </div>
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Carbs</p>

            <p className="fl-md__value">{food.foodItem.carbs}g</p>
          </div>
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Fats</p>

            <p className="fl-md__value">{food.foodItem.fats}g</p>
          </div>
        </div>
        <button>
          <span
            className="icon-button-sm button-warning-02 material-symbols-rounded"
            onClick={handleRemoveFood}
          >
            remove
          </span>
        </button>
      </div>
    </div>
  );
};

export default FoodItemCardAddList;
