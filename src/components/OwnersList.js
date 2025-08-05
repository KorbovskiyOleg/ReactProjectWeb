import React, { useState, useEffect } from "react";
import { SERVER_URL } from "../constants";

export default function OwnersList() {
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("jwt");
    
    fetch(SERVER_URL + "api/owners", {
      headers: { 
        "Authorization": `Bearer ${token}`  // ← Исправлено
      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) }); // Читаем текст ошибки
        }
        return response.json();
      })
      .then((data) => {
        setOwners(data._embedded.owners || []); // Защита от undefined
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <div>Загрузка данных...</div>;  // ← Добавлено
  }

  return (
    <div>
      <table>
        <tbody>
          {owners?.map((owner, index) => (  // ← Опциональная цепочка
            <tr key={index}>
              <td>{owner.firstName}</td>
              <td>{owner.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


