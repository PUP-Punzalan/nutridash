import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateMealForm = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if
  // };

  return (
    <div className="section--container">
      <div className="section">
        <h4>Create Meal</h4>
        <div className="form">
          <div className="input-group">
            <label htmlFor="meal-name">Meal name</label>
            <div class="input-unit">
              <input
                type="text"
                id="meal-name"
                placeholder="e.g. Favorite Breakfast"
              />
            </div>
          </div>

          <button className="button button-primary">Create meal</button>
        </div>
      </div>
    </div>
  );
};

export default CreateMealForm;
