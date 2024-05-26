import "./Edit.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Edit() {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const { id } = useParams();

  const getData = async () => {
    const data = await fetch("http://127.0.0.1:8051/announcement/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
    setDetails(
      JSON.parse(data.data)?.map((item) => ({
        id: item.pk,
        ...item.fields,
      }))[0] ?? null
    );
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(details);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    const jsonData = JSON.stringify(formObject);

    try {
      const response = await fetch(
        `http://127.0.0.1:8051/announcement/${details.id}/update`,
        {
          method: "PUT",
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
      alert("Something went wrong");
    }
  };

  if (!details) {
    return null;
  }

  return (
    <>
      <div className="block"></div>
      <div className="wrapper">
        <div className="form_container">
          <form onSubmit={onSubmit}>
            <h2 className="form_title">Your Announcement</h2>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              defaultValue={details.subject}
              name="subject"
            />
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              defaultValue={details.title}
              name="title"
            />
            <label htmlFor="content">Content</label>
            <textarea
              name="content"
              cols="40"
              rows="10"
              defaultValue={details.content}
              required=""
              id="id_content"
              style={{ "height'": "101px" }}
            ></textarea>
            <label htmlFor="content">Access</label>
            <select name="access" id="id_access">
              <option value="public" selected="">
                Public
              </option>
              <option value="local">Local</option>
            </select>
            <input type="submit" value="Edit" />
          </form>
        </div>
      </div>
    </>
  );
}

export default Edit;
