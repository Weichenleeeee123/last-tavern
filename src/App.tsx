import { useStore } from './store/useStore';
import { DoorScene } from './components/DoorScene/DoorScene';
import { TavernHall } from './components/TavernHall/TavernHall';
import { DialogueScene } from './components/DialogueScene/DialogueScene';
import { RecordCard } from './components/RecordCard/RecordCard';
import { SettingsPanel } from './components/Settings/SettingsPanel';

function App() {
  const scene = useStore((s) => s.currentScene);

  return (
    <>
      {scene === 'door' && <DoorScene />}
      {(scene === 'hall' || scene === 'dialogue') && <TavernHall />}
      {scene === 'dialogue' && <DialogueScene />}
      {scene === 'record' && <RecordCard />}
      <SettingsPanel />
    </>
  );
}

export default App;
