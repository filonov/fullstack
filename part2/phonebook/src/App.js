import React, { useState, useEffect } from 'react';
import Filtrator from './components/Filtrator';
import AddFormer from './components/AddFormer';
import Numbers from './components/Numbers';
import personsService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '040-123456', id: 1 },
    // { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    // { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    // { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const addPerson = (event) => {
    event.preventDefault();
    const result = persons.find(({ name }) => name === newName);
    if (!result) {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      };
      personsService
        .create(newPerson)
        .then(retPerson => {
          setPersons(persons.concat(retPerson));
          setNewName('');
          setNewNumber('');
        });
    } else {
      alert(`${newName} is already added to phonebook`);
    }
  }

  const deleteCallback = (event) => {
    const exId = parseInt(event.target.value, 10);
    const exterminated = persons.find(p => p.id === exId);
    if (window.confirm(`Do you really want to delete ${exterminated.name}?`)) {
      personsService.exterminate(exId);
      const newPersons = persons.filter((value) => { return value.id !== exId });
      setPersons(newPersons);
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = !filter
    ? persons
    : persons.filter(person => person.name.match(RegExp(filter, 'i')));

  useEffect(() => {
    personsService
      .getAll()
      .then(initPersons => {
        setPersons(initPersons);
      });
  }, []);

  return (
    <div>
      <h1>Phonebook</h1>
      <Filtrator filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new</h2>
      <AddFormer addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Numbers personsToShow={personsToShow} deleteCallback={deleteCallback} />
    </div>
  );
}

export default App;