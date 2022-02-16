import React from 'react';
import './App.css';
import Inventory from './Components/Inventory';
import Monsters from './Util/Monsters';

function App() {
    const monsterKeys = Object.keys(Monsters);
    const monsterImages = monsterKeys.map((x) => {
            console.log(Monsters[x].img);
            const imageSrc = Monsters[x].img;
            return (<React.Fragment>
                {x}
                <img src={imageSrc} alt={x}/>
            </React.Fragment>);
        });
  return (
    <div className="App">
      <header className="App-header">
          <p>
            Archnemesis Tracker
          </p>
      </header>
      <div className="App-body">
        <Inventory />  
        {monsterImages}
      </div>
    </div>
  );
}

export default App;
