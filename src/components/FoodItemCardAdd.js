import React, { useEffect } from "react";
import supabase from "../config/SupabaseClient";

const FoodItemCardAdd = ({ food, date, category, user }) => {
  const handleAddFood = async () => {
    console.log("Date: ", date);
    console.log("Category: ", category);
    console.log("Food: ", food.name);
    console.log("Food ID: ", food.food_item_id);
    console.log("User: ", user.id);

    try {
      const { data, error } = await supabase.from("dailyMeals").insert({
        user_id: user.id,
        food_id: food.food_item_id,
        category: category,
        date_consumed: date,
      });

      if (error) {
        throw error;
      }

      console.log("Data: ", data);
      window.location.reload();
    } catch (error) {
      console.error("Error adding food:", error.message);
    }
  };

  useEffect(() => {
    // const handleAddUserMeal = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from("userMeals")
    //       .insert({
    //       })
    //   }
    // }
  }, []);

  return (
    <div className="fl-md--container">
      <div className="fl-md__intro">
        <div className="fl-md__intro__section">
          {food.value} {food.unit}
        </div>
        <p>{food.name}</p>
        <p className={"ft-md ft-" + food.type}>{food.type}</p>
        <div></div>
      </div>

      <div className="fl-md--nutrients">
        <div className="fl-md__nutrients">
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Calories</p>
            <p className="fl-md__value">{food.calories}cal</p>
          </div>
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Proteins</p>
            <p className="fl-md__value">{food.proteins}g</p>
          </div>
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Carbs</p>
            <p className="fl-md__value">{food.carbs}g</p>
          </div>
          <div className="fl-md__macro">
            <p className="fs-small bold gray">Fats</p>
            <p className="fl-md__value">{food.fats}g</p>
          </div>
        </div>
        <button onClick={handleAddFood}>
          <span className="material-symbols-rounded chevron-date">add</span>
        </button>
      </div>
    </div>
  );
};

export default FoodItemCardAdd;
