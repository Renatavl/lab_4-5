import { useEffect, useState } from "react";
import "./List.css";
import Cookies from "js-cookie";

function List() {
  const [list, setList] = useState([]);
  const user_id = Cookies.get("user_id");

  const getData = async () => {
    const data = await fetch(
      "http://127.0.0.1:8051/announcements/all/" + user_id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((data) => data.json());
    setList(
      JSON.parse(data.data)?.map((item) => ({ id: item.pk, ...item.fields })) ??
        []
    );
  };

  const deleteAction = (id) => async () => {
    await fetch(`http://127.0.0.1:8051/announcement/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="wrapper_center">
        <div className="root_list">
          <ul className="list">
            <li className="column_title">
              <span className="title">Subject</span>
              <span className="title">Title</span>
              <span className="content">Content</span>
              <span className="access">Access</span>
              <span className="date">Date</span>
              <span className="actions">Actions</span>
            </li>
            {list.map((item) => (
              <li data-testid="list-item" key={item.id}>
                <strong>{item.subject}</strong>
                <strong>{item.title}</strong>
                <span>{item.content}</span>
                <span>{item.access}</span>
                <span>{item.create_date}</span>
                <div className="actionsB">
                  <a href={"/announcement/" + item.id}>View Details</a>
                  <a href={"/edit/announcement/" + item.id}>Edit</a>
                  <button onClick={deleteAction(item.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default List;
