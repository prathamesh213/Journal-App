import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  // State variables for capturing user input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form data here
    //console.log("Form submitted:", { name, email, age, gender });
    // You can perform further actions like sending data to backend, etc.
    const userData = { name: name, email: email, age: age, gender: gender };
    localStorage.setItem("userData", JSON.stringify(userData));
    navigate("/question");
  };

  return (
    <div className="bg-custom-image flex flex-col items-center justify-center min-h-screen text-black">
  
   
      <h1 className="text-5xl text-white font-semibold mb-4">
        Mind Mentor
      </h1>
      <form
        className=" mt-20 w-96 bg-white  text-black  rounded-xl px-6 py-8 "
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-black  mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="form-input w-full h-8 pl-2 rounded-md border border-gray-300"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-black  mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="form-input w-full h-8 pl-2 rounded-md border border-gray-300"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block text-black  mb-2">
            Age:
          </label>
          <input
            type="number"
            id="age"
            className="form-input w-full h-8 pl-2 rounded-md border border-gray-300"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <span className="block text-black  mb-2">Gender:</span>
          <div className="flex items-center justify-around text-black text-xl ">
            <label className="mr-2 ">
              <input
                type="radio"
                name="gender"
                value="1"
                checked={gender === "1"}
                onChange={() => setGender("1")}
                className="form-radio"
              />
              <span className="ml-1">Male</span>
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="0"
                checked={gender === "0"}
                onChange={() => setGender("0")}
                className="form-radio"
              />
              <span className="ml-1">Female</span>
            </label>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <button
            type="submit"
            className="bg-blue-400 text-white  px-4 py-2 rounded-md hover:bg-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    
  </div>

  );
};

export default Welcome;
