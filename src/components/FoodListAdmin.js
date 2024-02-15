import React, { useEffect, useState } from "react";
import supabase from "../config/SupabaseClient";

const FoodListAdmin = ({ food }) => {
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [foodData, setFoodData] = useState([
    {
      food_item_id: food.food_item_id,
      name: food.name,
      value: food.value,
      calories: food.calories,
      proteins: food.proteins,
      carbs: food.carbs,
      fats: food.fats,
      unit: food.unit,
      type: food.type,
    },
  ]);

  const handleChange = (e) => {
    setFoodData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from("foodItem")
        .update({
          name: foodData.name,
          type: foodData.type,
          value: foodData.value,
          unit: foodData.unit,
          calories: foodData.calories,
          proteins: foodData.proteins,
          carbs: foodData.carbs,
          fats: foodData.fats,
        })
        .eq("food_item_id", foodData.food_item_id)
        .select();

      if (error) {
        throw error;
      }

      // console.log("User updated successfully:", data);
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };
  const handleDelete = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", foodData.food_item_id)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        console.log("User deleted successfully:", data);
        window.location.reload();
      }
    } catch (error) {
      console.log("Error deleting user:", error.message);
    }

    console.log("Delete user: ", food.id);
  };

  useEffect(() => {
    if (!isDataFetched) {
      setFoodData({
        food_item_id: food.food_item_id,
        name: food.name,
        value: food.value,
        calories: food.calories,
        proteins: food.proteins,
        carbs: food.carbs,
        fats: food.fats,
        unit: food.unit,
        type: food.type,
      });

      setIsDataFetched(true);
    }
  }, []);

  console.log(foodData);

  return (
    <>
      <div className="food-list--wrapper">
        <input
          type="text"
          name="id"
          onChange={handleChange}
          value={foodData.food_item_id}
          disabled
        />
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={foodData.name}
        />
        <select
          type="text"
          name="type"
          onChange={handleChange}
          value={foodData.type}
        >
          <option value="Vegetable">Vegetable</option>
          <option value="Meat">Meat</option>
          <option value="Fruit">Fruit</option>
          <option value="Seafood">Seafood</option>
          <option value="Nut">Nut</option>
          <option value="Dairy">Dairy</option>
          <option value="Carbs">Carbs</option>
          <option value="Protein">Protein</option>
        </select>
        <input
          type="text"
          name="value"
          onChange={handleChange}
          value={foodData.value}
        />
        <select
          type="text"
          name="unit"
          onChange={handleChange}
          value={foodData.unit}
        >
          <option value="grams">Gram</option>
          <option value="ounce">Ounce</option>
          <option value="tablespoon">Tablespoon</option>
          <option value="slice">Slice</option>
          <option value="piece">Piece</option>
          <option value="medium piece">Medium Piece</option>
          <option value="cup">Cup</option>
          <option value="bowl">Bowl</option>
          <option value="serving">Serving</option>
        </select>
        <input
          type="text"
          name="calories"
          onChange={handleChange}
          value={foodData.calories}
        />
        <input
          type="text"
          name="proteins"
          onChange={handleChange}
          value={foodData.proteins}
        />
        <input
          type="text"
          name="carbs"
          onChange={handleChange}
          value={foodData.carbs}
        />
        <input
          type="text"
          name="fats"
          onChange={handleChange}
          value={foodData.fats}
        />
        <div>
          <button
            onClick={handleEdit}
            className="material-symbols-rounded icon-button-sm "
          >
            edit
          </button>
          <button
            onClick={handleDelete}
            className="material-symbols-rounded icon-button-sm icon-button-primary"
          >
            remove
          </button>
        </div>
      </div>
    </>
  );
};

export default FoodListAdmin;
