import { useGame } from './hooks/useGame';
import { SetupScreen } from './components/SetupScreen';
import { GameUI } from './components/GameUI';

export default function App() {
  const { state, initGame, rollDice, resetGame } = useGame();

  if (state.status === 'setup') {
    return <SetupScreen onStart={initGame} />;
  }

  return (
    <GameUI 
      state={state} 
      onRoll={rollDice} 
      onReset={resetGame} 
    />
  );
}
