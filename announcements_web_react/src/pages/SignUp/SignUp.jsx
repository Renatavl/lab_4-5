import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import Img from "../../img/registration.jpg";

function SignUp() {
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      const response = await fetch("http://127.0.0.1:8051/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        alert(errorMessage.message);
        return;
      }

      navigate("/login");
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="block"></div>
      <div className="form_container">
        <form id="registration-form" onSubmit={onSubmit}>
          <h2 className="form_title">Register</h2>
          <label htmlFor="fname">User name</label>
          <input type="text" id="fname" name="username" />
          <label htmlFor="password1">Password</label>
          <input type="password" id="password1" name="password1" />
          <label htmlFor="password2">Password</label>
          <input type="password" id="password2" name="password2" />
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" />
          <input type="submit" value="Register" />
        </form>
        <img src={Img} className="registration-img" />
      </div>
      <span className="frame"></span>
      <span className="message"></span>
      <span className="spiral">𖦹</span>
    </>
  );
}

export default SignUp;
