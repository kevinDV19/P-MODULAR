import React, { useState, useEffect } from 'react';

function PetList() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/pets/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setPets(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {pets.length > 0 ? (
                <ul>
                    {pets.map((pet) => (
                        <li key={pet.id}>
                            {pet.name} - {pet.breed} - {pet.age} years old
                        </li>
                    ))}
                </ul>
            ) : (
                <div>No pets available</div>
            )}
        </div>
    );
}

export default PetList;
