import React from "react";

const AddFoodComp = ({ getCategory, openModal }) => {
  return (
    <button
      className="button-sm button-neutral"
      onClick={() => {
        getCategory();
        openModal();
      }}
    >
      Add food
    </button>
  );
};

export default AddFoodComp;
