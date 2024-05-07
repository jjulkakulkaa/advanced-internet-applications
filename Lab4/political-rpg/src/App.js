import React, { useState } from 'react';
import story from './story.json';

function App() {
  const [currentSceneId, setCurrentSceneId] = useState(1);

  const handleOptionClick = (sceneId) => {
    setCurrentSceneId(sceneId);
  };

  const renderOptions = (options) => {
    return options.map((option, index) => (
      <button key={index} onClick={() => handleOptionClick(option.sceneId)}>
        {option.text}
      </button>
    ));
  };

  const renderScene = () => {
    const currentScene = story.scenes.find((scene) => scene.id === currentSceneId);
    return (
      <div>
        <p>{currentScene.text}</p>
        {renderOptions(currentScene.options)}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Welcome to the Political RPG</h1>
      {renderScene()}
    </div>
  );
}

export default App;
