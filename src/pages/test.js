import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../config/SupabaseClient";

const Test = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fetchError, setFetchError] = useState(null);

  const [feet, setFeet] = useState(0);
  const [inches, setInches] = useState(0);
  const [centimeters, setCentimeters] = useState(0);

  const [kilograms, setKilograms] = useState(0);
  const [pounds, setPounds] = useState(0);

  // const [userName, setUserName] = useState(null);
  // const [userEmail, setUserEmail] = useState(null);
  // const [userPassword, setUserPassword] = useState(null);
  // const [userBirthDate, setUserBirthDate] = useState(null);
  // const [userSex, setUserSex] = useState(null);
  // const [userHeight, setUserHeight] = useState(null);
  // const [userWeight, setUserWeight] = useState(null);

  const [formData, setFormData] = useState({
    user_nickname: "",
    user_email: "",
    user_password: "",
    user_sex: "",
    user_birth_date: "",

    user_height_ft: 0,
    user_height_in: 0,
    user_height_cm: 0,
    user_weight_kg: 0,
    user_weight_lb: 0,

    user_calorie_required: 0,
  });

  const handleChange = (e) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let dateOfBirthConverted = new Date(formData.user_birth_date);
      let currentDate = new Date();
      let duration = currentDate - dateOfBirthConverted;
      let age = Math.floor(Math.abs(duration / 3.154e10));
      console.log("Age: " + age);

      const { data, error } = supabase.auth.updateUser({
        email: formData.user_email,
        password: formData.user_password,
      });

      if (error) {
        setFetchError("Unexpected error occurred. Please try again.");
        throw error;
      }

      if (data) {
        console.log("Data" + data);
        setFetchError("Success");

        await updateCalorieRequired(
          formData.user_sex,
          formData.user_weight_kg,
          formData.user_height_cm,
          age
        );

        const { error } = await supabase
          .from("users")
          .update([
            {
              name: formData.user_nickname,
              sex: formData.user_sex,
              birth_date: formData.user_birth_date,
              height: formData.user_height_cm,
              weight: formData.user_weight_kg,
              calorie_required: formData.user_calorie_required,
            },
          ])
          .eq("id", data.user.id);

        if (error) {
          setFetchError("Unexpected error occurred. Please try again.");
          throw error;
        }
        setFetchError(null);
        console.log(data);
      }
    } catch (error) {
      console.log("Error: ", error);

      if (
        !formData.user_nickname ||
        !formData.user_email ||
        !formData.user_password ||
        !formData.user_birth_date ||
        !formData.user_height_ft ||
        !formData.user_height_in ||
        !formData.user_height_cm ||
        !formData.user_weight_kg ||
        !formData.user_weight_lb
      ) {
        setFetchError("Please fill in all fields");
      }
    }
  };

  //#region Calculators
  //#region Height converter
  const handleFeetChange = (event) => {
    const newFeet = parseInt(event.target.value, 10) || 0;
    setFeet(newFeet);
    updateCentimeters(newFeet, inches);
  };

  const handleInchesChange = (event) => {
    const newInches = parseInt(event.target.value, 10) || 0;
    setInches(newInches);
    updateCentimeters(feet, newInches);
  };

  const handleCentimetersChange = (event) => {
    const newCentimeters = parseInt(event.target.value, 10) || 0;
    setCentimeters(newCentimeters);
    updateFeetAndInches(newCentimeters);
  };

  const updateCentimeters = (feet, inches) => {
    const totalInches = feet * 12 + inches;
    const centimeters = totalInches * 2.54;
    setCentimeters(centimeters.toFixed(2));
    setFormData((prevData) => {
      return {
        ...prevData,
        user_height_ft: feet,
        user_height_in: inches,
        user_height_cm: centimeters,
      };
    });
  };

  const updateFeetAndInches = (centimeters) => {
    const totalInches = centimeters / 2.54;
    const newFeet = Math.floor(totalInches / 12);
    const newInches = Math.round(totalInches % 12);
    setFeet(newFeet.toFixed(2));
    setInches(newInches.toFixed(2));
    setFormData((prevData) => {
      return {
        ...prevData,
        user_height_ft: newFeet,
        user_height_in: newInches,
        user_height_cm: centimeters,
      };
    });
  };
  //#endregion Height converter

  //#region Weight converter
  const handleKilogramsChange = (event) => {
    const newKilograms = parseFloat(event.target.value) || 0;
    setKilograms(newKilograms);
    updatePounds(newKilograms);
  };

  const handlePoundsChange = (event) => {
    const newPounds = parseFloat(event.target.value) || 0;
    setPounds(newPounds);
    updateKilograms(newPounds);
  };

  const updatePounds = (kilograms) => {
    const pounds = kilograms * 2.20462;
    setPounds(pounds.toFixed(2));
    setFormData((prevData) => {
      return {
        ...prevData,
        user_weight_kg: kilograms,
        user_weight_lb: pounds,
      };
    });
  };

  const updateKilograms = (pounds) => {
    const kilograms = pounds / 2.20462;
    setKilograms(kilograms.toFixed(2));
    setFormData((prevData) => {
      return {
        ...prevData,
        user_weight_kg: kilograms,
        user_weight_lb: pounds,
      };
    });
  };
  //#endregion Weight converter

  //#region Calories calculator
  const updateCalorieRequired = (sex, kilograms, centimeters, age) => {
    console.log("Update Calorie Started");
    if (sex === "Female") {
      const calorie_required = (
        655.1 +
        9.563 * kilograms +
        1.85 * centimeters -
        4.676 * age
      ).toFixed(2);
      console.log("Calorie Required" + calorie_required);
      setFormData((prevData) => {
        return {
          ...prevData,
          user_calorie_required: calorie_required,
        };
      });
    } else if (sex === "Male") {
      const calorie_required = (
        66.47 +
        13.75 * kilograms +
        5.003 * centimeters
      ).toFixed(2);
      console.log("Calorie Required" + calorie_required);
      setFormData((prevData) => {
        return {
          ...prevData,
          user_calorie_required: calorie_required,
        };
      });
    }
    console.log("Update Calorie Ended");
  };
  //#endregion Calories calculator
  //#endregion Calculators

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setFormData({
            user_nickname: data.name,
            user_email: data.email,
            user_sex: data.sex,
            user_birth_date: data.birth_date,
            user_height_cm: data.height,
            user_weight_kg: data.weight,
            user_calorie_required: data.calorie_required,
          });

          // Update other state values accordingly
          const totalInches = data.height / 2.54;
          const newFeet = Math.floor(totalInches / 12);
          const newInches = Math.round(totalInches % 12);
          setFeet(newFeet);
          setInches(newInches);
          setCentimeters(data.height);
          setKilograms(data.weight);
          setPounds(data.weight * 2.20462);
        }
      } catch (error) {
        setFetchError("Error fetching user data");
        console.log(fetchError + error);
      }
    };

    fetchUserData();
  }, []);

  console.log(formData);

  return (
    <div className="">
      <div className="main--wrapper">
        {fetchError && <p className="error error-primary">{fetchError}</p>}

        <div className="main--header">
          <h4>Test</h4>
        </div>
        <form className="main--section form--wrapper" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="user_nickname">Nickname</label>
            <div className="input-unit">
              <input
                type="text"
                id="user_nickname"
                name="user_nickname"
                placeholder="e.g. John"
                value={formData.user_nickname}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="user_email">Email</label>
            <div className="input-unit">
              <input
                type="email"
                id="user_email"
                name="user_email"
                placeholder="e.g. johndoe@gmail.com"
                value={formData.user_email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="user_password">Password</label>
            <div className="input-unit">
              <input
                type="password"
                id="user_password"
                name="user_password"
                placeholder="********"
                value={formData.user_password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="user_birth_date">Birthdate</label>
            <div className="input-unit">
              <input
                type="date"
                id="user_birth_date"
                name="user_birth_date"
                value={formData.user_birth_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="user_sex">Sex</label>
            <div className="input-unit">
              <select
                id="user_sex"
                name="user_sex"
                value={formData.user_sex}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="input-groups-wrapper">
            <label htmlFor="user_height">Height</label>

            <div className="input-groups">
              <div className="input-group">
                <div className="input-unit">
                  <input
                    type="number"
                    id="user_height_ft"
                    name="user_height_ft"
                    value={formData.user_height_ft}
                    onChange={handleFeetChange}
                  />
                  <div className="absolute-unit">ft</div>
                </div>
              </div>

              <div className="input-group">
                <div className="input-unit">
                  <input
                    type="number"
                    id="user_height_in"
                    name="user_height_in"
                    value={formData.user_height_in}
                    onChange={handleInchesChange}
                  />
                  <div className="absolute-unit">in</div>
                </div>
              </div>

              <div className="input-divider">or</div>

              <div className="input-group">
                <div className="input-unit">
                  <input
                    type="number"
                    id="user_height_cm"
                    name="user_height_cm"
                    value={formData.user_height_cm}
                    onChange={handleCentimetersChange}
                  />
                  <div className="absolute-unit">cm</div>
                </div>
              </div>
            </div>
          </div>

          <div className="input-groups-wrapper">
            <label htmlFor="user_weight">Weight</label>
            <div className="input-groups">
              <div className="input-group">
                <div className="input-unit">
                  <input
                    type="number"
                    id="user_weight_kg"
                    name="user_weight_kg"
                    value={formData.user_weight_kg}
                    onChange={handleKilogramsChange}
                  />
                  <div className="absolute-unit">kg</div>
                </div>
              </div>

              <div className="input-divider">or</div>

              <div className="input-group">
                <div className="input-unit">
                  <input
                    type="number"
                    id="user_weight_lb"
                    name="user_weight_lb"
                    value={formData.user_weight_lb}
                    onChange={handlePoundsChange}
                  />
                  <div className="absolute-unit">lb</div>
                </div>
              </div>
            </div>
          </div>

          <button className="button button-primary">Update Test</button>
        </form>
      </div>
    </div>
  );
};

export default Test;
