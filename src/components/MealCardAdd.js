import React, { useState } from "react";
import FoodItemCardAddList from "./FoodItemCardList";
import FoodItemCardAdd from "./FoodItemCardAdd";
import FoodItemCardJustList from "./FoodItemCardJustList";
import supabase from "../config/SupabaseClient";

const MealCardAdd = ({ meal, dailyMeals, date, category, user }) => {
  // List of user meal's id
  const [isMealAdded, setIsMealAdded] = useState(false);

  let listOfUserMealID = meal.daily_meals_ids.map((id) => {
    return id;
  });

  // List of daily meals id
  let listOfDailyMealID = dailyMeals.map((dailyMeal) => {
    return dailyMeal.id;
  });

  // Filtered IDs
  let filteredIDs = listOfUserMealID.filter((id) => {
    return listOfDailyMealID.includes(id);
  });

  // Row specific to the category
  let filteredFoodID = dailyMeals.filter((dailyMeal) => {
    return filteredIDs.includes(dailyMeal.id);
  });
  console.log(filteredFoodID);

  const handleAddMeal = async () => {
    try {
      // Iterate over the filteredFoodID array and add each food item
      for (const food of filteredFoodID) {
        await supabase.from("dailyMeals").insert({
          user_id: user.id,
          food_id: food.foodItem.food_item_id,
          category: category,
          date_consumed: date,
        });
      }
      console.log("All meals added successfully");
      window.location.reload(); // Consider better ways to update UI after adding meals
    } catch (error) {
      console.error("Error adding meals:", error.message);
    }
  };

  return (
    <>
      <div className="ml-sm--container">
        <div className="ml-sm--header">
          <div className="ml-sm--header__section">
            <p className="bold">{category}</p>
          </div>
          <div className="ml-sm--header__section">
            <p className="bold">{meal.date_consumed}</p>
          </div>
          <div className="ml-sm--header__section">
            <button
              onClick={handleAddMeal}
              className="button-sm button-neutral"
              disabled={filteredFoodID.length === 0} // Disable button if no food items
            >
              Add all meals
            </button>
          </div>
        </div>
        {filteredFoodID.length !== 0
          ? filteredFoodID.map((food) => (
              <div key={food.food_id}>
                <ul className="fl-sm--wrapper">
                  {food.category === category ? (
                    <>
                      <FoodItemCardJustList
                        food={food.foodItem}
                        isMealAdded={setIsMealAdded}
                        date={date}
                        category={category}
                        // user={user}
                      />
                    </>
                  ) : null}
                </ul>
              </div>
            ))
          : null}
      </div>
    </>
  );
};

export default MealCardAdd;
