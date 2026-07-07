import { useStore } from './store/useStore';
import { DoorScene } from './components/DoorScene/DoorScene';

function App() {
  const scene = useStore((s) => s.currentScene);

  if (scene === 'door') {
    return <DoorScene />;
  }

  return (
    <div className="min-h-screen bg-tavern-bg flex items-center justify-center">
      <p className="text-tavern-gold font-serif-cn text-xl">
        场景建设中...
      </p>
    </div>
  );
}

export default App;
