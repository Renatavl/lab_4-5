import "./Create.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Img from "../../img/create_announcement.jpg";

function Create() {
  const navigate = useNavigate();
  const user_id = Cookies.get("user_id");

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    const jsonData = JSON.stringify({ user_id, ...formObject });

    try {
      const response = await fetch(
        "http://127.0.0.1:8051/announcements/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        alert(errorMessage.message);
        return;
      }

      navigate("/announcements/user");
    } catch (error) {
      // alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="block"></div>
      <div className="form_container">
        <form id="create-form" onSubmit={onSubmit} data-testid="create-form">
          <h2 className="form_title">Create Announcement</h2>
          <label htmlFor="subject">Subject</label>
          <input type="text" id="subject" name="subject" />
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            cols="40"
            rows="10"
            required=""
            id="content"
            style={{ height: "101px" }}
          />
          <label htmlFor="access">Access</label>
          <select name="access" id="access" defaultValue="public">
            <option value="public">Public</option>
            <option value="local">Local</option>
          </select>
          <input type="submit" value="Create Announcement" />
        </form>
        <img src={Img} className="registration-img" />
      </div>
      <span className="pencil">✎</span>
      <span className="message"></span>
      <span className="horn">📢</span>
    </>
  );
}

export default Create;
