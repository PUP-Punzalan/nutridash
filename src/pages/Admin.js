import React, { useEffect, useState } from "react";
import supabase from "../config/SupabaseClient";
import UserLists from "../components/UserLists";
import FoodListAdmin from "../components/FoodListAdmin";

const Admin = ({ token }) => {
  const [fetchError, setFetchError] = useState(null);

  const [adminData, setAdminData] = useState({});
  const [allUsersData, setAllUsersData] = useState([]);
  const [allFoodsData, setAllFoodsData] = useState([]);
  const [allDailyMealsData, setAllDailyMealsData] = useState([]);

  const [isFetchedData, setIsFetchedData] = useState(false);

  useEffect(() => {
    if (!isFetchedData) {
      try {
        const fetchAdminData = async () => {
          const { data, error } = await supabase
            .from("users")
            .select()
            .eq("id", token.user.id)
            .single();
          if (error) {
            throw error;
          }
          if (data) {
            setAdminData(data);
            console.log("Admin: ", data);
          }
        };

        const fetchAllUsersData = async () => {
          const { data, error } = await supabase.from("users").select();
          if (error) {
            throw error;
          }
          if (data) {
            setAllUsersData(data);
            console.log("Users: ", data);
          }
        };

        const fetchAllFoodsData = async () => {
          const { data, error } = await supabase.from("foodItem").select();
          if (error) {
            throw error;
          }
          if (data) {
            setAllFoodsData(data);
            console.log("Foods: ", data);
          }
        };

        const fetchAllDailyMealsData = async () => {
          const { data, error } = await supabase.from("dailyMeals").select();
          if (error) {
            throw error;
          }
          if (data) {
            setAllDailyMealsData(data);
            console.log("Daily Meals: ", data);
          }
        };

        fetchAdminData();

        fetchAllUsersData();
        fetchAllFoodsData();
        fetchAllDailyMealsData();

        setIsFetchedData(true);
      } catch (error) {
        console.error("Error fetching admin data:", error.message);
      }
    }
  }, []);

  return (
    <>
      <div className="main--wrapper">
        <div className="main--header">
          <h4>Admin</h4>
        </div>
        <div className="main--section">
          <h5>Users</h5>
          <div className="user-list--wrapper">
            <p className="bold">User ID</p>
            <p className="bold">Name</p>
            <p className="bold">Email</p>
            <p className="bold">Sex</p>
            <p className="bold">Birthdate</p>
            <p className="bold">Height</p>
            <p className="bold">Weight</p>
            <p className="bold">Action</p>
          </div>
          {allUsersData.map((user) => (
            <UserLists key={user.id} user={user} />
          ))}
        </div>
        <div className="main--section">
          <h5>Foods</h5>
          <div className="food-list--wrapper">
            <p className="bold">Food ID</p>
            <p className="bold">Name</p>
            <p className="bold">Type</p>
            <p className="bold">Value</p>
            <p className="bold">Unit</p>
            <p className="bold">Calories</p>
            <p className="bold">Proteins</p>
            <p className="bold">Carbs</p>
            <p className="bold">Fats</p>
            <p className="bold">Action</p>
          </div>
          {allFoodsData.map((food) => (
            <FoodListAdmin key={food.id} food={food} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Admin;
