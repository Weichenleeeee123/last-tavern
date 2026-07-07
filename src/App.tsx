import { useStore } from './store/useStore';
import { DoorScene } from './components/DoorScene/DoorScene';
import { TavernHall } from './components/TavernHall/TavernHall';
import { DialogueScene } from './components/DialogueScene/DialogueScene';
import { SettingsPanel } from './components/Settings/SettingsPanel';

function App() {
  const scene = useStore((s) => s.currentScene);

  return (
    <>
      {scene === 'door' && <DoorScene />}
      {scene === 'hall' && <TavernHall />}
      {scene === 'dialogue' && <DialogueScene />}
      {scene === 'record' && (
        <div className="min-h-screen bg-tavern-bg flex items-center justify-center">
          <p className="text-tavern-gold font-serif-cn text-xl">记录卡建设中...</p>
        </div>
      )}
      <SettingsPanel />
    </>
  );
}

export default App;
