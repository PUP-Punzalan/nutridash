import React, { useEffect, useState } from "react";
import supabase from "../config/SupabaseClient";

const UserLists = ({ user }) => {
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [userData, setUserData] = useState([
    {
      id: user.id,
      name: user.name,
      email: user.email,
      sex: user.sex,
      birth_date: user.birth_date,
      height: user.height,
      weight: user.weight,
    },
  ]);

  const handleChange = (e) => {
    setUserData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: userData.name,
          sex: userData.sex,
          height: userData.height,
          weight: userData.weight,
        })
        .eq("id", userData.id)
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
        .eq("id", userData.id)
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

    console.log("Delete user: ", user.id);
  };

  useEffect(() => {
    if (!isDataFetched) {
      setUserData({
        id: user.id,
        name: user.name,
        email: user.email,
        sex: user.sex,
        birth_date: user.birth_date,
        height: user.height,
        weight: user.weight,
      });

      setIsDataFetched(true);
    }
  }, []);

  console.log(userData);

  return (
    <>
      <div className="user-list--wrapper">
        <input
          type="text"
          name="id"
          onChange={handleChange}
          value={userData.id}
          disabled
        ></input>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={userData.name}
        ></input>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={userData.email}
          disabled
        ></input>
        <select
          type="text"
          name="sex"
          onChange={handleChange}
          value={userData.sex}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="date"
          name="birth_date"
          onChange={handleChange}
          value={userData.birth_date}
          disabled
        ></input>
        <input
          type="number"
          name="height"
          onChange={handleChange}
          value={userData.height}
        ></input>
        <input
          type="number"
          name="weight"
          onChange={handleChange}
          value={userData.weight}
        ></input>
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

export default UserLists;
