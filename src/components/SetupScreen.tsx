import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Users, Grid3X3, Play } from 'lucide-react';

interface SetupScreenProps {
  onStart: (playerNames: string[], size: number) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [boardSize, setBoardSize] = useState(10);

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Snake & Ladder</CardTitle>
          <CardDescription>Configure your game and start playing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Users size={18} />
              <Label>Number of Players</Label>
            </div>
            <Select 
              value={numPlayers.toString()} 
              onValueChange={(v) => setNumPlayers(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select players" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Players</SelectItem>
                <SelectItem value="3">3 Players</SelectItem>
                <SelectItem value="4">4 Players</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold text-slate-700">Player Names</Label>
            <div className="grid gap-3">
              {Array.from({ length: numPlayers }).map((_, i) => (
                <Input 
                  key={i}
                  placeholder={`Player ${i + 1} Name`}
                  value={playerNames[i]}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:ring-primary"
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Grid3X3 size={18} />
                <Label>Board Size</Label>
              </div>
              <span className="text-primary font-bold">{boardSize}x{boardSize}</span>
            </div>
            <Slider 
              value={[boardSize]} 
              min={6} 
              max={12} 
              step={2} 
              onValueChange={(v) => {
                if (Array.isArray(v)) setBoardSize(v[0]);
                else if (typeof v === 'number') setBoardSize(v);
              }}
              className="py-4"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              <span>Small (6x6)</span>
              <span>Medium (10x10)</span>
              <span>Large (12x12)</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
            onClick={() => onStart(playerNames.slice(0, numPlayers), boardSize)}
          >
            <Play className="mr-2 h-5 w-5" /> Start Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
