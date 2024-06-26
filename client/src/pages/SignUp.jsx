import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const SignUp = () => {
  const initialState = {
    username: "",
    email: "",
    password: "",
    role: "student",
  };
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // toast.loading("Signing Up...");
      console.log(formData);
      const res = await axios.post("/api/users/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success, message } = res.data;

      if (success) {
        toast.success(message);
        navigate("/signin");
      }
      setFormData(initialState);
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      <section className="bg-gray-50 font-poppins ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-4 ">
          <div className="w-full  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Sign Up
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Username
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.username}
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5     "
                    placeholder="username"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Email
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.email}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5     "
                    placeholder="name@gmail.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.password}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5     "
                    required=""
                  />
                </div>

                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-900 "
                >
                  Who are you
                </label>
                <select
                  required
                  value={formData?.role}
                  onChange={handleChange}
                  name="role"
                  id="role"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5 "
                >
                  <option value="student">Student</option>
                  <option value="landlord">Landlord</option>
                </select>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Create an account
                </button>
                <p className="space-x-2 text-sm font-light text-gray-500 ">
                  <span> Already have an account?</span>
                  <Link
                    to="/signin"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
