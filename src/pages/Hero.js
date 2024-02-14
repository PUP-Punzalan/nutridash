import React, { useEffect, useState } from "react";
import supabase from "../config/SupabaseClient";
import FoodItemCard from "../components/FoodItemCard";

const Hero = () => {
  const [fetchError, setFetchError] = useState(null);
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);

  const [orderBy, setOrderBy] = useState("type");
  const [ascendingSort, setAscendingSort] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      const { data, error } = await supabase
        .from("foodItem")
        .select()
        .order(orderBy, { ascending: ascendingSort });

      if (error) {
        setFoods(null);
        setFetchError(error);
      }
      if (data) {
        setFoods(data);
        setFetchError(null);
      }
    };

    fetchFoods();
  }, [orderBy, ascendingSort]);

  useEffect(() => {
    const filtered = foods.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFoods(filtered);
  }, [searchQuery, foods]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log(searchQuery);
  };

  const handleSortChange = (e) => {
    if (e.target.value === "ascending") {
      setAscendingSort(true);
    } else {
      setAscendingSort(false);
    }
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  return (
    <div>
      {fetchError && <p>{fetchError}</p>}

      {foods && (
        <div className="main--wrapper">
          <div className="main--header_flex">
            <h4>Food Items</h4>
            <div className="header__section">
              <div className="order-sort--wrapper">
                <select onChange={handleSortChange}>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
              <div className="order-sort--wrapper">
                <select onChange={handleOrderChange}>
                  <option value="type">Type</option>
                  <option value="name">Name</option>
                  <option value="calories">Calories</option>
                </select>
              </div>
              <div className="search--wrapper">
                <input
                  type="text"
                  placeholder="Search food items..."
                  value={searchQuery}
                  onChange={handleSearch}
                  id="search"
                ></input>
                <label htmlFor="search" className="material-symbols-rounded">
                  search
                </label>
              </div>
            </div>
          </div>
          {filteredFoods.map((food) => (
            <FoodItemCard key={food.food_item_id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
