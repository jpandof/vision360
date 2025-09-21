import { useState } from 'react';

import './App.css';
import { Button } from './components/ui/button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex gap-2 mb-4">
      <Button onClick={() => setCount(count => count + 1)}>
        count is {count}
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}

export default App;
