import { useState } from "react";
import AppInput from "./compoents/AppInput";
import { Gender, genderSchema } from "./types/gender";

// import { useState } from 'react';
function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [gender, setGender] = useState<Gender>("");
  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;

    const { success } = genderSchema.safeParse(value);
    if (success) {
      setGender(value as Gender);
      return;
    }

    alert("Invalid gender");
  }

  return (
    <>
      <h1>Signup</h1>
      <form>
        <AppInput
          value={email}
          name="email"
          type="email"
          handleChange={(event) => setEmail(event.target.value)}
        >
          Email
        </AppInput>

        <label htmlFor="gender">Gender</label>
        <select
          name="gender"
          id="gender"
          onChange={handleSelectChange}
          value={gender}
        >
          <option value="" disabled>
            Choose your gender
          </option>
          <option value="male">Male</option>
          <option value="female">female</option>
          <option value="other">Other</option>
        </select>
        <br />

        <AppInput
          value={password}
          type="password"
          name="password"
          handleChange={(event) => setPassword(event.target.value)}
        >
          Password
        </AppInput>

        <AppInput
          value={confirmPassword}
          type="password"
          name="confirmPassword"
          handleChange={(event) => setConfirmPassword(event.target.value)}
        >
          Confirm Password
        </AppInput>

        <button type="submit">Signup</button>
      </form>
    </>
  );
}
export default App;
