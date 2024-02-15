import { useEffect, useState } from "react";
import supabase from "../config/SupabaseClient";
import Modal from "../components/Modal";
import FoodItemCardAdd from "../components/FoodItemCardAdd";
import FoodItemCardAddList from "../components/FoodItemCardList";
import AddFoodComp from "../components/AddFoodComp";
import CategorySummary from "../components/CategorySummary";
import AddMealComp from "../components/AddMealComp";
import MealCardAdd from "../components/MealCardAdd";
import { useNavigate } from "react-router-dom";

const Home = ({ token }) => {
  const navigate = useNavigate();
  const [pageError, setPageError] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    sex: "",
    birth_date: "",
    height: "",
    weight: "",
    calorie_required: "",
    role: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);

  const [foodData, setFoodData] = useState([]);
  const [mealData, setMealData] = useState([]);

  const [foodCategory, setFoodCategory] = useState("Breakfast");
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem("convertedDate");
    if (savedDate) {
      return new Date(savedDate);
    } else {
      const currentDate = new Date();
      localStorage.setItem(
        "convertedDate",
        currentDate.toISOString().split("T")[0]
      );
      return currentDate;
    }
  });
  const [convertedDate, setConvertedDate] = useState();
  const [convertedDateWord, setConvertedDateWord] = useState("");
  const savedDate = localStorage.getItem("convertedDate");

  if (!savedDate) {
    localStorage.setItem("convertedDate", convertedDate);
  }

  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);

  const [orderBy, setOrderBy] = useState("created_at");
  const [ascendingSort, setAscendingSort] = useState(true);

  const [isAddFoodModalOpen, setAddFoodModalOpen] = useState(false);
  const [isAddMealModalOpen, setAddMealModalOpen] = useState(false);

  const openAddFoodModal = () => setAddFoodModalOpen(true);
  const closeAddFoodModal = () => setAddFoodModalOpen(false);

  const openAddMealModal = () => setAddMealModalOpen(true);
  const closeAddMealModal = () => setAddMealModalOpen(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("id", token.user.id)
          .single();

        if (error) {
          throw error;
        }
        if (data) {
          setUserData({
            name: data.name,
            email: data.email,
            sex: data.sex,
            birth_date: data.birth_date,
            height: data.height,
            weight: data.weight,
            calorie_required: data.calorie_required,
            protein_required: data.protein_required,
            carbs_required: data.carbs_required,
            fat_required: data.fat_required,
            role: data.role,
          });
          if (userData.role === null) {
            setUserData({ ...userData, role: "" });
          }
          setPageError(null);
        }
      } catch (error) {
        setUserData(null);
        setPageError("Error fetching user data");
        console.log(pageError + error);
      }
    };

    const fetchFoods = async () => {
      const { data, error } = await supabase
        .from("foodItem")
        .select()
        .order(orderBy, { ascending: ascendingSort });

      if (error) {
        setFoods(null);
        setPageError(error);
      }
      if (data) {
        setFoods(data);
        setPageError(null);
      }
    };

    const fetchUserDailyMeals = async () => {
      try {
        const { data, error } = await supabase
          .from("dailyMeals")
          .select("* , foodItem(*)")
          .eq("user_id", token.user.id)
          .order("id", { ascending: true });

        if (error) {
          throw error;
        }

        setFoodData(data);
        console.log("User daily meals: ", data);
      } catch (error) {
        console.error("Error fetching foods:", error.message);
      }
    };

    const fetchUserMealList = async () => {
      try {
        const { data, error } = await supabase
          .from("userMeals")
          .select("*")
          .eq("user_id", token.user.id)
          .order("id", { ascending: true });

        if (error) {
          throw error;
        }

        console.log("User meals: ", data);
        setMeals(data);
      } catch (error) {
        console.log("Error fetching user meals: ", error.message);
      }
    };

    fetchUserDailyMeals();
    fetchUserMealList();
    fetchFoods();

    getUserData();
    convertDate(selectedDate);
  }, [selectedDate, convertedDate]);

  useEffect(() => {
    const filteredFood = foods.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Update
    const filteredMeal = meals.filter((meal) => {
      return meal.category === foodCategory;
    });

    setFilteredMeals(filteredMeal);
    // const filteredMeal = meals.filter((meal)=> meal.name.toLowerCase().includes(searchQuery.toLowerCase()));
    localStorage.setItem("convertedDate", convertedDate);
    // console.log("Saved date: ", savedDate);
    setFilteredFoods(filteredFood);
  }, [convertedDate, selectedDate, searchQuery, foods, meals, foodCategory]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log(searchQuery);
  };

  //#region calculators
  const incrementDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
    convertDate(newDate);
  };

  const decrementDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
    convertDate(newDate);
  };

  const convertDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    setConvertedDate(`${year}-${month}-${day}`);
    setConvertedDateWord(date.toDateString());
  };
  //#endregion calculators

  const filteredFoodData = foodData.filter((food) => {
    const dateMatch = food.date_consumed.includes(convertedDate);
    const categoryMatch = food.category.includes(foodCategory);

    return categoryMatch && dateMatch;
  });

  // const breakfastFoodData = foodData.filter((food) => {
  //   const categoryMatch = filteredFoodData.category.includes("Breakfast");
  //   return categoryMatch;
  // });

  const breakfastFoodData = foodData.filter((food) => {
    const dateMatch = food.date_consumed.includes(savedDate);
    const categoryMatch = food.category.includes("Breakfast");

    return categoryMatch && dateMatch;
  });

  const lunchFoodData = foodData.filter((food) => {
    const dateMatch = food.date_consumed.includes(savedDate);
    const categoryMatch = food.category.includes("Lunch");

    return categoryMatch && dateMatch;
  });

  const dinnerFoodData = foodData.filter((food) => {
    const dateMatch = food.date_consumed.includes(savedDate);
    const categoryMatch = food.category.includes("Dinner");

    return categoryMatch && dateMatch;
  });

  const snacksFoodData = foodData.filter((food) => {
    const dateMatch = food.date_consumed.includes(convertedDate);
    const categoryMatch = food.category.includes("Snacks");

    return categoryMatch && dateMatch;
  });

  let totalCaloriesBreakfast = 0;
  let totalProteinsBreakfast = 0;
  let totalCarbsBreakfast = 0;
  let totalFatsBreakfast = 0;
  let totalCaloriesLunch = 0;
  let totalProteinsLunch = 0;
  let totalCarbsLunch = 0;
  let totalFatsLunch = 0;
  let totalCaloriesDinner = 0;
  let totalProteinsDinner = 0;
  let totalCarbsDinner = 0;
  let totalFatsDinner = 0;
  let totalCaloriesSnacks = 0;
  let totalProteinsSnacks = 0;
  let totalCarbsSnacks = 0;
  let totalFatsSnacks = 0;

  breakfastFoodData.forEach((food) => {
    totalCaloriesBreakfast += food.foodItem.calories;
    totalProteinsBreakfast += food.foodItem.proteins;
    totalCarbsBreakfast += food.foodItem.carbs;
    totalFatsBreakfast += food.foodItem.fats;
  });

  let breakfastData = {
    totalCalories: totalCaloriesBreakfast,
    totalProteins: totalProteinsBreakfast,
    totalCarbs: totalCarbsBreakfast,
    totalFats: totalFatsBreakfast,
  };

  lunchFoodData.forEach((food) => {
    totalCaloriesLunch += food.foodItem.calories;
    totalProteinsLunch += food.foodItem.proteins;
    totalCarbsLunch += food.foodItem.carbs;
    totalFatsLunch += food.foodItem.fats;
  });

  let lunchData = {
    totalCalories: totalCaloriesLunch,
    totalProteins: totalProteinsLunch,
    totalCarbs: totalCarbsLunch,
    totalFats: totalFatsLunch,
  };

  dinnerFoodData.forEach((food) => {
    totalCaloriesDinner += food.foodItem.calories;
    totalProteinsDinner += food.foodItem.proteins;
    totalCarbsDinner += food.foodItem.carbs;
    totalFatsDinner += food.foodItem.fats;
  });

  let dinnerData = {
    totalCalories: totalCaloriesDinner,
    totalProteins: totalProteinsDinner,
    totalCarbs: totalCarbsDinner,
    totalFats: totalFatsDinner,
  };

  snacksFoodData.forEach((food) => {
    totalCaloriesSnacks += food.foodItem.calories;
    totalProteinsSnacks += food.foodItem.proteins;
    totalCarbsSnacks += food.foodItem.carbs;
    totalFatsSnacks += food.foodItem.fats;
  });

  let snacksData = {
    totalCalories: totalCaloriesSnacks,
    totalProteins: totalProteinsSnacks,
    totalCarbs: totalCarbsSnacks,
    totalFats: totalFatsSnacks,
  };

  let totalData = {
    totalCalories:
      totalCaloriesBreakfast +
      totalCaloriesLunch +
      totalCaloriesDinner +
      totalCaloriesSnacks,
    totalProteins:
      totalProteinsBreakfast +
      totalProteinsLunch +
      totalProteinsDinner +
      totalProteinsSnacks,
    totalCarbs:
      totalCarbsBreakfast +
      totalCarbsLunch +
      totalCarbsDinner +
      totalCarbsSnacks,
    totalFats:
      totalFatsBreakfast + totalFatsLunch + totalFatsDinner + totalFatsSnacks,
  };

  return (
    <div>
      <Modal isOpen={isAddFoodModalOpen} onClose={closeAddFoodModal}>
        <div className="main--header_flex">
          <h4>Add Food for {foodCategory}</h4>
          <div className="header__section">
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
          <div className="fl-md--wrapper">
            <FoodItemCardAdd
              key={food.food_item_id}
              food={food}
              date={convertedDate}
              category={foodCategory}
              user={token.user}
            />
          </div>
        ))}
      </Modal>
      <Modal isOpen={isAddMealModalOpen} onClose={closeAddMealModal}>
        <div className="main--header_flex">
          <h4>Add Meal for {foodCategory}</h4>
          <div className="header__section">
            {/* <div className="search--wrapper">
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
            </div> */}
          </div>
        </div>
        {filteredMeals.map((meal) => (
          <div className="ml-sm--wrapper">
            <MealCardAdd
              key={meal.id}
              meal={meal}
              dailyMeals={foodData}
              date={convertedDate}
              category={foodCategory}
              user={token.user}
            />
          </div>
        ))}
      </Modal>
      <div className="main--wrapper">
        {pageError && <p className="error error-primary">{pageError}</p>}

        <div className="main--header">
          <h4>Welcome back, {userData.name} 👋</h4>
          <p>Here's your daily summary of calories and macronutrients.</p>
          {userData.role === "admin" ? (
            <button
              className="button button-admin"
              onClick={() => {
                navigate("/admin");
              }}
            >
              Admin View
            </button>
          ) : null}
        </div>

        <div className="main--section">
          <h5>Summary</h5>
          <div className="macros">
            <div className="macro">
              <h5>Calories</h5>
              <div className="remaining">
                <p className="intake">
                  <span className="">{totalData.totalCalories}</span>g
                </p>
                <p className="subtitle">out of</p>
                <p className="total">
                  <span className="">{userData.calorie_required}</span>g
                </p>
              </div>
            </div>
            <div className="macro">
              <h5>Protein</h5>
              <div className="remaining">
                <p className="intake">
                  <span className="">{totalData.totalProteins}</span>g
                </p>
                <p className="subtitle">out of</p>
                <p className="total">
                  <span className="">{userData.protein_required}</span>g
                </p>
              </div>
            </div>
            <div className="macro">
              <h5>Carbs</h5>
              <div className="remaining">
                <p className="intake">
                  <span className="">{totalData.totalCarbs}</span>g
                </p>
                <p className="subtitle">out of</p>
                <p className="total">
                  <span className="">{userData.carbs_required}</span>g
                </p>
              </div>
            </div>
            <div className="macro">
              <h5>Fats</h5>
              <div className="remaining">
                <p className="intake">
                  <span className="">{totalData.totalFats}</span>g
                </p>
                <p className="subtitle">out of</p>
                <p className="total">
                  <span className="">{userData.fat_required}</span>g
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="main--section">
          <div className="header__container">
            <h5>Meal List</h5>
          </div>

          <div className="date-navigation inner__section">
            {/* <p>{foodCategory}</p> */}
            <button onClick={decrementDate}>
              {" "}
              <span className="material-symbols-rounded chevron-date">
                chevron_left
              </span>
            </button>
            {/* <div>{convertedDate}</div> */}
            <div>{convertedDateWord}</div>
            <button onClick={incrementDate}>
              {" "}
              <span className="material-symbols-rounded chevron-date">
                chevron_right
              </span>
            </button>
          </div>

          <div className="food-list-category inner__section">
            <div className="food-list__category">
              <div className="food-list__title">
                <div className="food-list__title-wrapper">
                  <p>Breakfast</p>
                  <div className="food-list__title_section">
                    <AddFoodComp
                      getCategory={() => {
                        setFoodCategory("Breakfast");
                        return foodCategory;
                      }}
                      openModal={openAddFoodModal}
                    ></AddFoodComp>
                    <AddMealComp
                      getCategory={() => {
                        setFoodCategory("Breakfast");
                        return foodCategory;
                      }}
                      openModal={openAddMealModal}
                    ></AddMealComp>
                  </div>
                </div>
              </div>
              <div className="food-list__container">
                <div>
                  {breakfastFoodData.length !== 0
                    ? breakfastFoodData.map((food) => (
                        <div key={food.id}>
                          <ul className="fl-sm--wrapper">
                            <FoodItemCardAddList food={food} />
                          </ul>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
            <div className="food-list__category">
              <div className="food-list__title">
                <div className="food-list__title-wrapper">
                  <p>Lunch</p>
                  <div className="food-list__title_section">
                    <AddFoodComp
                      getCategory={() => {
                        setFoodCategory("Lunch");
                        return foodCategory;
                      }}
                      openModal={openAddFoodModal}
                    ></AddFoodComp>
                    <AddMealComp
                      getCategory={() => {
                        setFoodCategory("Lunch");
                        return foodCategory;
                      }}
                      openModal={openAddMealModal}
                    ></AddMealComp>
                  </div>
                </div>
              </div>
              <div className="food-list__container">
                <div>
                  {lunchFoodData.length !== 0
                    ? lunchFoodData.map((food) => (
                        <div key={food.id}>
                          <ul>
                            <FoodItemCardAddList food={food} />
                          </ul>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
            <div className="food-list__category">
              <div className="food-list__title">
                <div className="food-list__title-wrapper">
                  <p>Dinner</p>
                  <div className="food-list__title_section">
                    <AddFoodComp
                      getCategory={() => {
                        setFoodCategory("Dinner");
                        return foodCategory;
                      }}
                      openModal={openAddFoodModal}
                    ></AddFoodComp>
                    <AddMealComp
                      getCategory={() => {
                        setFoodCategory("Dinner");
                        return foodCategory;
                      }}
                      openModal={openAddMealModal}
                    ></AddMealComp>
                  </div>
                </div>
              </div>
              <div className="food-list__container">
                <div>
                  {dinnerFoodData.length !== 0
                    ? dinnerFoodData.map((food) => (
                        <div key={food.id}>
                          <ul>
                            <FoodItemCardAddList food={food} />
                          </ul>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
            <div className="food-list__category">
              <div className="food-list__title">
                <div className="food-list__title-wrapper">
                  <p>Snacks</p>
                  <div className="food-list__title_section">
                    <AddFoodComp
                      getCategory={() => {
                        setFoodCategory("Snacks");
                        return foodCategory;
                      }}
                      openModal={openAddFoodModal}
                    ></AddFoodComp>
                    <AddMealComp
                      getCategory={() => {
                        setFoodCategory("Snacks");
                        return foodCategory;
                      }}
                      openModal={openAddMealModal}
                    ></AddMealComp>
                  </div>
                </div>
              </div>
              <div className="food-list__container">
                <div>
                  {snacksFoodData.length !== 0
                    ? snacksFoodData.map((food) => (
                        <div key={food.id}>
                          <ul>
                            <FoodItemCardAddList food={food} />
                          </ul>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
            <div className="food-list__category">
              <div className="food-list__title">
                <div className="food-list__title-wrapper">
                  <p>Total and Summary</p>
                </div>
              </div>
              <div className="food-list__container">
                <div className="category-summary">
                  <CategorySummary category="Breakfast" data={breakfastData} />
                  <CategorySummary category="Lunch" data={lunchData} />
                  <CategorySummary category="Dinner" data={dinnerData} />
                  <CategorySummary category="Snacks" data={snacksData} />
                  <CategorySummary category="Overall Total" data={totalData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
