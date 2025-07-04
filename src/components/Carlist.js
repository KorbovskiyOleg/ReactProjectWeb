 import React, {useEffect, useState } from 'react';
 import { SERVER_URL } from '../constants.js';
 import { DataGrid } from '@mui/x-data-grid';


 function Carlist() {
     const [cars, setCars] = useState([]);

     const columns = [
  {field: 'brand', headerName: 'Brand', width: 200},
  {field: 'model', headerName: 'Model', width: 200},
  {field: 'color', headerName: 'Color', width: 200},
  {field: 'yearOfCar', headerName: 'Year', width: 150},
  {field: 'price', headerName: 'Price', width: 150},
   {
    field: '_links.self.href', 
    headerName: '', 
    sortable: false,
    filterable: false,
    renderCell: row => 
      <button 
         onClick={() => onDelClick(row.id)}>Delete
      </button>
   }
 ];

     useEffect(() => {
        fetchCars(); }, []);

    const fetchCars = () => {
  fetch(SERVER_URL + 'api/cars')
  .then(response => response.json())
  .then(data => setCars(data._embedded.cars))
  .catch(err => console.error(err));    
   }

    const onDelClick = (url) => {
  fetch(url,  {method:  'DELETE'})
  .then(response => fetchCars())
  .catch(err => console.error(err))
 }


  return(
     <div style={{ height: 500, width: '100%' }}>
    <DataGrid 
      rows={cars} 
      columns={columns} 
      getRowId={row => row._links.self.href}/>
  </div>
  );
 }
 export default Carlist;