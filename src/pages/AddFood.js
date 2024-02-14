import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/SupabaseClient";

const AddFood = () => {
  const navigate = useNavigate();

  const [fetchError, setFetchError] = useState(null);

  const [foodName, setFoodName] = useState(null);
  const [foodValue, setFoodValue] = useState(null);
  const [foodUnit, setFoodUnit] = useState("Gram");
  const [foodCalories, setFoodCalories] = useState(null);
  const [foodProteins, setFoodProteins] = useState(null);
  const [foodCarbs, setFoodCarbs] = useState(null);
  const [foodFats, setFoodFats] = useState(null);
  const [foodType, setFoodType] = useState("Vegetable");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      foodName,
      foodValue,
      foodUnit,
      foodCalories,
      foodProteins,
      foodCarbs,
      foodFats,
      foodType
    );

    if (
      !foodName ||
      !foodValue ||
      !foodUnit ||
      !foodCalories ||
      !foodProteins ||
      !foodCarbs ||
      !foodFats ||
      !foodType
    ) {
      setFetchError("Please fill in all the fields correctly.");
      return;
    }

    const { data, error } = await supabase
      .from("foodItem")
      .insert([
        {
          name: foodName,
          value: foodValue,
          calories: foodCalories,
          proteins: foodProteins,
          carbs: foodCarbs,
          fats: foodFats,
          unit: foodUnit,
          type: foodType,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      setFetchError("Unexpected error occurred. Please try again.");
    }
    if (data) {
      console.log(data);
      setFetchError(null);
      navigate("/food-list");
    }
  };

  useEffect(() => {
    console.log(foodType);
    console.log(foodUnit);
  }, [foodType, foodUnit]);

  return (
    <div class="">
      <div className="main--wrapper">
        <div className="main--header">
          <h4>Add food</h4>
        </div>
        <form className="main--section form--wrapper" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="food-name">Food name</label>
            <div class="input-unit">
              <input
                type="text"
                id="food-name"
                placeholder="e.g. Chocolate Cake"
                value={foodName}
                onChange={(e) => {
                  setFoodName(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="input-groups">
            <div className="input-group">
              <label htmlFor="food-value">Value</label>
              <div class="input-unit">
                <input
                  type="number"
                  step="any"
                  id="food-value"
                  placeholder="e.g. 1"
                  value={foodValue}
                  onChange={(e) => {
                    setFoodValue(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="food-unit">Unit</label>
              <div class="input-unit">
                <select
                  id="food-unit"
                  onChange={(e) => {
                    setFoodUnit(e.target.value);
                  }}
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
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="food-type">Food type</label>
              <div class="input-unit">
                <select
                  id="food-type"
                  value={foodType}
                  onChange={(e) => {
                    setFoodType(e.target.value);
                  }}
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
              </div>
            </div>
          </div>
          <div className="input-groups">
            <div className="input-group">
              <label htmlFor="food-calories">Calories</label>
              <div class="input-unit">
                <input
                  type="number"
                  step="any"
                  id="food-calories"
                  value={foodCalories}
                  onChange={(e) => {
                    setFoodCalories(e.target.value);
                  }}
                />
                <div className="input__unit">cal</div>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="food-proteins">Proteins</label>
              <div class="input-unit">
                <input
                  type="number"
                  step="any"
                  id="food-proteins"
                  value={foodProteins}
                  onChange={(e) => {
                    setFoodProteins(e.target.value);
                  }}
                />
                <div className="input__unit">g</div>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="food-carbs">Carbs</label>
              <div class="input-unit">
                <input
                  type="number"
                  step="any"
                  id="food-carbs"
                  value={foodCarbs}
                  onChange={(e) => {
                    setFoodCarbs(e.target.value);
                  }}
                />
                <div className="input__unit">g</div>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="food-fats">Fats</label>
              <div class="input-unit">
                <input
                  type="number"
                  step="any"
                  id="food-fats"
                  value={foodFats}
                  onChange={(e) => {
                    setFoodFats(e.target.value);
                  }}
                />
                <div className="input__unit">g</div>
              </div>
            </div>
          </div>
          <button className="button button-primary">Add food</button>
        </form>
        {fetchError && <p className="error error-primary">{fetchError}</p>}
      </div>
    </div>
  );
};

export default AddFood;
