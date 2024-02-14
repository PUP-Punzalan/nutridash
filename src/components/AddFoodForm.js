import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/SupabaseClient";

const AddFoodForm = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const [foodName, setFoodName] = useState(null);
  const [foodValue, setFoodValue] = useState(null);
  const [foodUnit, setFoodUnit] = useState(null);
  const [foodCalories, setFoodCalories] = useState(null);
  const [foodProteins, setFoodProteins] = useState(null);
  const [foodCarbs, setFoodCarbs] = useState(null);
  const [foodFats, setFoodFats] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !foodName ||
      !foodValue ||
      !foodUnit ||
      !foodCalories ||
      !foodProteins ||
      !foodCarbs ||
      !foodFats
    ) {
      setError("Please fill in all the fields correctly.");
      return;
    }

    const { data, error } = await supabase
      .from("FoodItem")
      .insert([
        {
          foodName,
          foodValue,
          foodUnit,
          foodCalories,
          foodProteins,
          foodCarbs,
          foodFats,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      setError("Unexpected error occurred. Please try again.");
    }
    if (data) {
      console.log(data);
      setError(null);
      navigate("/home");
    }
  };

  return (
    <div className="section--container">
      <form className="section" onSubmit={handleSubmit}>
        <h4>Add food</h4>
        <div className="form">
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
                <input
                  type="text"
                  id="food-unit"
                  placeholder="e.g. Cups or Grams"
                  value={foodUnit}
                  onChange={(e) => {
                    setFoodUnit(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="input-groups">
            <div className="input-group">
              <label htmlFor="food-calories">Calories</label>
              <div class="input-unit">
                <input
                  type="number"
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
        </div>
      </form>
      {error && <p className="error error-primary">{error}</p>}
    </div>
  );
};

export default AddFoodForm;
