import React, { useEffect, useState } from "react";
import supabase from "../config/SupabaseClient";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formError, setFormError] = useState(null);

  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [centimeters, setCentimeters] = useState("");
  const [kilograms, setKilograms] = useState("");
  const [pounds, setPounds] = useState("");

  const [formData, setFormData] = useState({
    user_nickname: "",
    user_email: "",
    user_password: "",
    user_sex: "Male",
    user_birth_date: "",

    user_height_ft: 0,
    user_height_in: 0,
    user_height_cm: 0,
    user_weight_kg: 0,
    user_weight_lb: 0,

    user_calorie_required: 0,
    user_protein_required: 0,
    user_carb_required: 0,
    user_fat_required: 0,
  });

  console.log(formData);
  console.log(
    "Feet: " + feet + " Inches: " + inches + " Centimeters: " + centimeters
  );
  console.log("Kilograms: " + kilograms + " Pounds: " + pounds);

  const handleChange = (e) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });

    console.log(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let dateOfBirthConverted = new Date(formData.user_birth_date);
      let currentDate = new Date();
      let duration = currentDate - dateOfBirthConverted;
      let age = Math.floor(Math.abs(duration / 3.154e10));
      console.log("Age: " + age);

      const { data, error } = await supabase.auth.signUp({
        email: formData.user_email,
        password: formData.user_password,
      });

      if (error) {
        setFormError("Invalid email or password. Please try again.");
        throw error;
      }

      if (data) {
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
              protein_required: formData.user_protein_required,
              carbs_required: formData.user_carb_required,
              fat_required: formData.user_fat_required,
            },
          ])
          .eq("id", data.user.id)
          .select();

        if (error) {
          setFormError("Unexpected error occurred. Please try again.");
          throw error;
        }

        setFormError("Successfully registered account. Please log in.");
      }
    } catch (error) {
      console.log("Error" + error);

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
        setFormError("Please fill in all fields");
      }
    }
  };

  //#region Calculators
  //#region Height converter
  const handleFeetChange = (event) => {
    const newFeet = parseInt(event.target.value, 10) || 0;
    setFeet((prevFeet) => newFeet);
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
          user_protein_required: (calorie_required * 0.2).toFixed(2),
          user_carb_required: (calorie_required * 0.55).toFixed(2),
          user_fat_required: (calorie_required * 0.25).toFixed(2),
        };
      });
    } else if (sex === "Male") {
      const calorie_required = (
        66.47 +
        13.75 * kilograms +
        5.003 * centimeters
      ).toFixed(2);
      console.log("Calorie Required " + calorie_required);
      setFormData((prevData) => {
        return {
          ...prevData,
          user_calorie_required: calorie_required,
          user_protein_required: (calorie_required * 0.2).toFixed(2),
          user_carb_required: (calorie_required * 0.55).toFixed(2),
          user_fat_required: (calorie_required * 0.25).toFixed(2),
        };
      });
    }
    console.log(
      "Update Calorie Ended",
      formData.user_calorie_required,
      formData.user_protein_required,
      formData.user_carb_required,
      formData.user_fat_required
    );
  };

  //#endregion Calories calculator
  //#endregion Calculators

  // Console Logs

  useEffect(() => {
    const calculateCalories = async () => {
      // Calculate calories based on updated form data
      const sex = formData.user_sex;
      const kilograms = formData.user_weight_kg;
      const centimeters = formData.user_height_cm;
      let dateOfBirthConverted = new Date(formData.user_birth_date);
      let currentDate = new Date();
      let duration = currentDate - dateOfBirthConverted;
      let age = Math.floor(Math.abs(duration / 3.154e10));

      if (sex === "Female") {
        const calorie_required = (
          655.1 +
          9.563 * kilograms +
          1.85 * centimeters -
          4.676 * age
        ).toFixed(2);
        setFormData((prevData) => ({
          ...prevData,
          user_calorie_required: calorie_required,
          user_protein_required: (calorie_required * 0.2).toFixed(2),
          user_carb_required: (calorie_required * 0.55).toFixed(2),
          user_fat_required: (calorie_required * 0.25).toFixed(2),
        }));
      } else if (sex === "Male") {
        const calorie_required = (
          66.47 +
          13.75 * kilograms +
          5.003 * centimeters
        ).toFixed(2);
        setFormData((prevData) => ({
          ...prevData,
          user_calorie_required: calorie_required,
          user_protein_required: (calorie_required * 0.2).toFixed(2),
          user_carb_required: (calorie_required * 0.55).toFixed(2),
          user_fat_required: (calorie_required * 0.25).toFixed(2),
        }));
      }
    };

    calculateCalories();
  }, [
    formData.user_sex,
    formData.user_weight_kg,
    formData.user_height_cm,
    formData.user_birth_date,
  ]);

  return (
    <div className="page-section">
      {formError && <p className="error error-primary">{formError}</p>}

      <form onSubmit={handleSubmit} className="form-section">
        <h4 className="form-title">Sign Up</h4>

        <div className="input-field-group">
          <div className="input__label">
            <label htmlFor="user_nickname">Nickname</label>
          </div>
          <div className="input__group">
            <input
              type="text"
              id="user_nickname"
              name="user_nickname"
              placeholder="e.g. John"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-field-group">
          <div className="input__label">
            <label htmlFor="user_email">Email</label>
          </div>
          <div className="input__group">
            <input
              type="email"
              id="user_email"
              name="user_email"
              placeholder="e.g. johndoe@gmail.com"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-field-group">
          <div className="input__label">
            <label htmlFor="user_password">Password</label>
          </div>
          <div className="input__group">
            <input
              type="password"
              id="user_password"
              name="user_password"
              placeholder="********"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-field-group">
          <div className="input__label">
            <label htmlFor="user_birth_date">Birthdate</label>
          </div>
          <div className="input__group">
            <input
              type="date"
              id="user_birth_date"
              name="user_birth_date"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-field-group">
          <div className="input__label">
            <label htmlFor="user_sex">Sex</label>
          </div>
          <div className="input__group">
            <select id="user_sex" name="user_sex" onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="input-field-group">
          <div className="input__label">
            <label htmlFor="user_height">Height</label>
          </div>
          <div className="input__groups">
            <div className="input__group">
              <input
                type="number"
                id="user_height_ft"
                name="user_height_ft"
                value={feet}
                onChange={handleFeetChange}
              />
              <div className="absolute-unit">ft</div>
            </div>
            <div className="input__group">
              <input
                type="number"
                id="user_height_in"
                name="user_height_in"
                value={inches}
                onChange={handleInchesChange}
              />
              <div className="absolute-unit">in</div>
            </div>
            <div className="input__group__divider">or</div>
            <div className="input__group">
              <input
                type="number"
                id="user_height_cm"
                name="user_height_cm"
                value={centimeters}
                onChange={handleCentimetersChange}
              />
              <div className="absolute-unit">cm</div>
            </div>
          </div>
        </div>
        <div className="input-field-group">
          <div className="input__label">
            <label htmlFor="user_weight">Weight</label>
          </div>
          <div className="input__groups">
            <div className="input__group">
              <input
                type="number"
                id="user_weight_kg"
                name="user_weight_kg"
                value={kilograms}
                onChange={handleKilogramsChange}
              />
              <div className="absolute-unit">kg</div>
            </div>
            <div className="input__group__divider">or</div>
            <div className="input__group">
              <input
                type="number"
                id="user_weight_lb"
                name="user_weight_lb"
                value={pounds}
                onChange={handlePoundsChange}
              />
              <div className="absolute-unit">lb</div>
            </div>
          </div>
        </div>

        <button className="button button-primary">Sign up</button>
        <div className="button-field">
          <p>Already have an account?</p>
          <Link className="Link" to="/">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
