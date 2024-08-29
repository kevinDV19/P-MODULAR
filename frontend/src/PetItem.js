// src/PetItem.js
import React from 'react';

function PetItem({ pet }) {
  return (
    <li>
      <h2>{pet.name}</h2>
      <p>Breed: {pet.breed}</p>
      <p>Age: {pet.age}</p>
      <p>Description: {pet.description}</p>
    </li>
  );
}

export default PetItem;