import React, { useState } from 'react';
import './App.css';
import data from "./bags.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

function App() {
  const [sortedBags, setSortedBags] = useState([...data.bags]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBagName, setNewBagName] = useState('');
  const [newBagColor, setNewBagColor] = useState('');
  const [newBagRating, setNewBagRating] = useState('');
  const [newBagImg, setNewBagImg] = useState('');

  const sortBagsByRating = () => {
    const sorted = [...sortedBags].sort((a, b) => b.rating - a.rating);
    setSortedBags(sorted);
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const filteredBags = sortedBags.filter(bag => {
    return bag.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const deleteBag = (index) => {
    const updatedBags = [...sortedBags];
    updatedBags.splice(index, 1);
    setSortedBags(updatedBags);
  };


  const addBag = () => {
    if (!newBagName || !newBagColor || !newBagRating || !newBagImg) return;
    const newBag = {
      name: newBagName,
      color: newBagColor,
      rating: parseInt(newBagRating),
      img: newBagImg
    };
    setSortedBags([newBag, ...sortedBags]);
    setNewBagName('');
    setNewBagColor('');
    setNewBagRating('');
    setNewBagImg('');
  };

  return (
      <>
      <div className="App">
      <header className="App-header">Bags List</header>
      <div>
        <div className="search-filter">
          <Button variant="secondary" onClick={sortBagsByRating}>Sort by Rating</Button>
          <input 
            type="text" 
            placeholder="Search by Name" 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
        </div>
        <div className="add-bag">
          <input 
            type="text" 
            placeholder="Name" 
            value={newBagName} 
            onChange={(e) => setNewBagName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Color" 
            value={newBagColor} 
            onChange={(e) => setNewBagColor(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Rating" 
            value={newBagRating} 
            onChange={(e) => setNewBagRating(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Image URL" 
            value={newBagImg} 
            onChange={(e) => setNewBagImg(e.target.value)}
          />
          <Button variant="primary" onClick={addBag}>Add</Button>
        </div>
      </div>
      <div className='Table-container'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Color</th>
              <th>Rating</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBags.map((bag, index) => (
              <tr key={index}>
                <td>{bag.name}</td>
                <td>{bag.color}</td>
                <td>{bag.rating}</td>
                <td>
                  <img src={bag.img} alt="Bag" style={{ width: '100px', height: 'auto' }} />
                </td>
                <td>
                  <Button variant="danger" onClick={() => deleteBag(index)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
    </>
  );
}

export default App;
