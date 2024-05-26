import "./Details.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Details() {
  const [details, setDetails] = useState(null);
  const { id } = useParams();

  const getData = async () => {
    const data = await fetch("http://127.0.0.1:8051/announcement/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
    setDetails(JSON.parse(data.data)[0]?.fields ?? null);
  };

  useEffect(() => {
    getData();
  }, []);

  if (!details) {
    return null;
  }

  return (
    <>
      <div className="block"></div>
      <div className="wrapper">
        <div className="root_card">
          <form>
            <h2 className="form_title2">Announcement Details</h2>
            <ul>
              <li>
                <strong>Title:</strong>
                <p>{details.title}</p>
              </li>
              <li>
                <strong>Content:</strong>
                <p>{details.content}</p>
              </li>
              <li>
                <strong>Access:</strong>
                <p>{details.access}</p>
              </li>
              <li>
                <strong>Location:</strong>
                <p>{details.location}</p>
              </li>

              <li>
                <strong>Created at:</strong>
                <p>{details.create_date}</p>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </>
  );
}

export default Details;
