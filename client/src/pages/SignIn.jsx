import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setTokens } from "../slices/authSlice";
import { toast } from "react-toastify";
import { setUser } from "../slices/userSlice";
const initialState = {
  email: "",
  password: "",
};
const SignIn = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Signing In..");
      const { data, status } = await axios.post("/api/users/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(data);
      const {
        accessToken,
        refreshToken,
        success,
        message,
        data: userdata,
      } = data;
      dispatch(setUser(userdata));
      dispatch(setTokens({ accessToken, refreshToken }));
      console.log(message);
      if (success) {
        toast.dismiss();
        toast.success(message);

        navigate("/");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message || "An error occurred.");
    }
  };

  return (
    <div className="font-poppins flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                value={formData.email}
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              {/* <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div> */}
            </div>
            <div className="mt-2">
              <input
                onChange={handleChange}
                value={formData.password}
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="space-x-2 mt-10 text-center text-sm text-gray-500">
          <span>Create Accout</span>
          <Link
            to="/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
