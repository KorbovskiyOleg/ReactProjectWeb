 import React, {useEffect, useState } from 'react';
  import { SERVER_URL } from '../constants.js'

 function Carlist() {
     const [cars, setCars] = useState([]);

     useEffect(() => {
        fetch(SERVER_URL+'api/cars')
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err)); }, [])


  return(
    <div> <table>
      <tbody>
      {
        cars.map((car, index) =>
          <tr key={index}>
            <td>{car.brand}</td>
            <td>{car.model}</td>
            <td>{car.color}</td>
            <td>{car.yearOfCar}</td>
            <td>{car.registerNumber}</td>
            <td>{car.price}</td>
          </tr>)
      }
      </tbody>
    </table></div>
  );
 }
 export default Carlist;