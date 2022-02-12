import { useState } from "react";

export const useInput = (params) => {
  const [inputs, setInputs] = useState(params);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return [inputs, handleChange];
};
