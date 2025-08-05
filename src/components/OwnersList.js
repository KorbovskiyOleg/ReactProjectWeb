/*import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const OwnersList = () => {
  // Пример данных владельцев
  const owners = [
    { id: 1, name: "Иван Иванов", phone: "+79123456789", email: "ivan@example.com" },
    { id: 2, name: "Петр Петров", phone: "+79234567890", email: "petr@example.com" }
  ];

  const columns = [
    { field: "name", headerName: "ФИО", width: 200 },
    { field: "phone", headerName: "Телефон", width: 180 },
    { field: "email", headerName: "Email", width: 250 }
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Owners Cars
      </Typography>
      <DataGrid
        rows={owners}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default OwnersList;*/

/*import React, { useState, useEffect } from "react";
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
      headers: { Authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        setOwners(data._embedded.owners);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
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
          {owners.map((owner, index) => (
            <tr key={index}>
              <td>{owner.first_name}</td>
              <td>{owner.last_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/

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

/*import React, { useState, useEffect } from "react";
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
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then((data) => {
        // Исправлено: берем данные из data._embedded.owners
        setOwners(data._embedded.owners || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <div>Загрузка данных...</div>;
  }

  if (owners.length === 0) {
    return <div>Нет данных о владельцах</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Фамилия</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner, index) => (
            <tr key={index}>
              {/* Исправлено: используем firstName и lastName вместо first_name/last_name }
              <td>{owner.firstName}</td>
              <td>{owner.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/
