 import React, {useEffect, useState } from 'react';

 function Carlist() {
     const [cars, setCars] = useState([]);

     useEffect(() => {
        fetch('http://localhost:8080/api/cars')
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err)); }, [])


  return(
    <div></div>
  );
 }
 export default Carlist;