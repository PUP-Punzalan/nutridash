import React from "react";

const AddMealComp = ({ getCategory, openModal }) => {
  return (
    <button
      className="button-sm button-neutral"
      onClick={() => {
        getCategory();
        openModal();
      }}
    >
      Add Meal
    </button>
  );
};

export default AddMealComp;
