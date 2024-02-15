import React, { useEffect, useState } from "react";
import supabase from "../config/SupabaseClient";
import { Link, useNavigate } from "react-router-dom";

const SignIn = ({ setToken }) => {
  let navigate = useNavigate();

  const [formError, setFormError] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isFetchedData, setIsFetchedData] = useState(false);

  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
  });
  console.log(formData);

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.user_email,
        password: formData.user_password,
      });

      if (error) {
        setFormError("Invalid email or password. Please try again.");
        throw error;
      }
      if (data) {
        console.log("Success: " + data);
        setFormError(null);
        setToken(data);

        // Redirect to admin page if user is admin
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.log("Error: ", error);

      if (!formData.user_email || !formData.user_password) {
        setFormError("Please fill in all fields");
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("email", formData.user_email)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          console.log("Data: ", data);
          setIsFetchedData(true);
          if (data.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [formData, isFetchedData]);

  return (
    <div className="page-section">
      {formError && <p className="error error-primary">{formError}</p>}

      <form onSubmit={handleSubmit} className="form-section">
        <h4 className="form-title">Sign in </h4>

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

        <button className="button button-primary">Sign in</button>
        <div className="button-field">
          <p>Don't have an account yet?</p>
          <Link className="Link" to="/sign-up">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
