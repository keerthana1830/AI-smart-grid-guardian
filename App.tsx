import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Light, GridEvent, Achievement, LightState, HighScore, Page, Reward, Theme, HardwareUpdate } from './types';
import { INITIAL_LIGHTS, SIMULATION_INTERVAL, FAULT_DURATION, ACHIEVEMENTS, MAX_EVENTS, LEADERBOARD_KEY, MAX_LEADERBOARD_ENTRIES } from './constants';
import { REWARDS } from './rewards';
import { connectSerial, disconnectSerial } from './services/serialService';

import AchievementsToast from './components/AchievementsToast';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AchievementsPage from './pages/AchievementsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import RewardsPage from './pages/RewardsPage';

import { initAudio, playFaultSound, playClearSound, playAchievementSound } from './services/audioService';

const SAVE_KEY = 'smartGridSave';

const App: React.FC = () => {
  const [lights, setLights] = useState<Light[]>(INITIAL_LIGHTS);
  const lastKnownStates = useRef<Record<number, LightState>>({});

  const [events, setEvents] = useState<GridEvent[]>([]);
  const [gameStats, setGameStats] = useState({ score: 0, level: 1, streak: 0 });
  const { score, level, streak } = gameStats;
  const [eventCounts, setEventCounts] = useState({ faults: 0, clears: 0 });


  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [unlockedRewards, setUnlockedRewards] = useState<Reward[]>([]);
  const [showToast, setShowToast] = useState<Achievement | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  
  const [user, setUser] = useState<string | null>(null);
  const [page, setPage] = useState<Page>('login');
  const [isHardwareConnected, setIsHardwareConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [baudRate, setBaudRate] = useState<number>(9600);
  
  // Load state from localStorage on initial mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(SAVE_KEY);
      const savedScores = localStorage.getItem(LEADERBOARD_KEY);
      const savedTheme = localStorage.getItem('theme') as Theme | null;

      if (savedState) {
        const data = JSON.parse(savedState);
        setUser(data.user || null);
        setGameStats({
          score: data.score || 0,
          level: data.level || 1,
          streak: data.streak || 0,
        });
        const revivedEvents = (data.events || []).map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) }));
        setEvents(revivedEvents);
        setUnlockedAchievements(data.unlockedAchievements || []);
        setUnlockedRewards(data.unlockedRewards || []);
        
        // Handle loading event counts, with backward compatibility for old save files
        if (data.eventCounts) {
            setEventCounts(data.eventCounts);
        } else if (revivedEvents.length > 0) {
            const faults = revivedEvents.filter((e: GridEvent) => e.type === 'fault').length;
            const clears = revivedEvents.filter((e: GridEvent) => e.type === 'clear').length;
            setEventCounts({ faults, clears });
        }

        if (data.user) {
          setPage('dashboard');
        }
      }

      if (savedScores) {
        setHighScores(JSON.parse(savedScores));
      }

      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    } catch (error) {
      console.error("Failed to load saved state from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if(user) {
        try {
            const stateToSave = {
                user,
                score: gameStats.score,
                level: gameStats.level,
                streak: gameStats.streak,
                events,
                eventCounts,
                unlockedAchievements,
                unlockedRewards
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }
  }, [user, gameStats, events, eventCounts, unlockedAchievements, unlockedRewards]);

  // Effect to apply theme class and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);


  // Update leaderboard whenever score changes
  useEffect(() => {
    const lowestHighScore = highScores.length > 0 ? highScores[highScores.length - 1].score : 0;
    
    if (user && score > 0 && (score > lowestHighScore || highScores.length < MAX_LEADERBOARD_ENTRIES)) {
        const newEntry = { score, date: new Date().toLocaleDateString() };
        
        const updatedScores = [...highScores.filter(s => s.score !== score), newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_LEADERBOARD_ENTRIES);

        if (JSON.stringify(updatedScores) !== JSON.stringify(highScores)) {
            setHighScores(updatedScores);
            try {
                localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedScores));
            } catch (error) {
                console.error("Failed to save high scores to localStorage", error);
            }
        }
    }
  }, [score, highScores, user]);

  const handleEnableAudio = () => {
    if (initAudio()) {
      setAudioReady(true);
    }
  };

  const addEvent = useCallback((message: string, lightId: number, type: 'fault' | 'clear') => {
    setEvents(prevEvents => {
      const newEvent: GridEvent = {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        message,
        lightId,
        type,
      };
      return [newEvent, ...prevEvents].slice(0, MAX_EVENTS);
    });
  }, []);

  const checkForUnlocks = useCallback((currentScore: number, faultCount: number, clearedCount: number, currentLevel: number) => {
    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedAchievements.some(ua => ua.id === achievement.id)) {
        if (achievement.condition(currentScore, faultCount, clearedCount)) {
          setUnlockedAchievements(prev => [...prev, achievement]);
          setShowToast(achievement);
          playAchievementSound();
          setTimeout(() => setShowToast(null), 5000);
        }
      }
    });
    REWARDS.forEach(reward => {
        if (!unlockedRewards.some(ur => ur.id === reward.id)) {
            if (reward.condition(currentLevel, clearedCount)) {
                setUnlockedRewards(prev => [...prev, reward]);
            }
        }
    });
  }, [unlockedAchievements, unlockedRewards]);

  // INTERNAL SIMULATION - Runs only if hardware is NOT connected
  useEffect(() => {
    if (!user || isHardwareConnected) return;

    const runSimulation = () => {
      const healthyLights = lights.filter(l => l.state === LightState.OK);
      if (healthyLights.length === 0) return;

      const randomLightIndex = Math.floor(Math.random() * healthyLights.length);
      const targetLight = healthyLights[randomLightIndex];
      
      setLights(prev => prev.map(l => l.id === targetLight.id ? { ...l, state: LightState.FAULT } : l));
      addEvent(`Light ${targetLight.id} is FAULTING`, targetLight.id, 'fault');
      setEventCounts(prev => ({ ...prev, faults: prev.faults + 1 }));
      playFaultSound();
      setGameStats(prev => ({ ...prev, streak: 0 })); // Reset streak on new fault

      setTimeout(() => {
          setLights(prevLights => {
            const lightToClear = prevLights.find(l => l.id === targetLight.id);
            if(lightToClear && lightToClear.state === LightState.FAULT) {
                addEvent(`Light ${targetLight.id} fault CLEARED`, targetLight.id, 'clear');
                playClearSound();
                
                setEventCounts(prevCounts => {
                    const newCounts = { ...prevCounts, clears: prevCounts.clears + 1 };
                    
                    setGameStats(prevStats => {
                      const newScore = prevStats.score + 100 + (prevStats.streak * 10);
                      const newStreak = prevStats.streak + 1;
                      const newLevel = Math.floor(newScore / 500) + 1;
                      
                      checkForUnlocks(newScore, newCounts.faults, newCounts.clears, newLevel);
                      
                      return { score: newScore, streak: newStreak, level: newLevel };
                    });

                    return newCounts;
                });

                return prevLights.map(l => l.id === targetLight.id ? { ...l, state: LightState.OK } : l);
            }
            return prevLights;
          });
      }, FAULT_DURATION);
    };

    const timer = setInterval(runSimulation, SIMULATION_INTERVAL);
    return () => clearInterval(timer);
  }, [user, isHardwareConnected, lights, addEvent, checkForUnlocks]);


  const handleSerialData = useCallback((update: HardwareUpdate) => {
      const previousLightState = lastKnownStates.current[update.lightId] || LightState.OK;
      
      if (update.state !== previousLightState) {
          setLights(prevLights => 
            prevLights.map(l => l.id === update.lightId ? { ...l, state: update.state } : l)
          );
          lastKnownStates.current[update.lightId] = update.state;

          if (update.state === LightState.FAULT) {
              addEvent(`Light ${update.lightId} is FAULTING`, update.lightId, 'fault');
              setEventCounts(prev => ({ ...prev, faults: prev.faults + 1 }));
              playFaultSound();
              setGameStats(prev => ({ ...prev, streak: 0 }));
          } else if (update.state === LightState.OK) { // This implies previous state was FAULT
              addEvent(`Light ${update.lightId} fault CLEARED`, update.lightId, 'clear');
              playClearSound();
              
              setEventCounts(prevCounts => {
                  const newCounts = { ...prevCounts, clears: prevCounts.clears + 1 };
                  
                  setGameStats(prevStats => {
                    const newScore = prevStats.score + 100 + (prevStats.streak * 10);
                    const newStreak = prevStats.streak + 1;
                    const newLevel = Math.floor(newScore / 500) + 1;

                    checkForUnlocks(newScore, newCounts.faults, newCounts.clears, newLevel);
                    
                    return { score: newScore, streak: newStreak, level: newLevel };
                });

                return newCounts;
            });
          }
      }
  }, [addEvent, checkForUnlocks]);

  const handleUnexpectedDisconnect = useCallback((message?: string) => {
    setIsHardwareConnected(prevState => {
      if (prevState) { // Only alert if we thought we were connected
        const alertMessage = message || "Hardware disconnected unexpectedly. Please check the connection and reconnect.";
        alert(alertMessage);
        setLights(INITIAL_LIGHTS);
        lastKnownStates.current = {};
      }
      return false; // In any case, we are now disconnected
    });
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    setPage('dashboard');
    handleEnableAudio();
  };
  
  const handleLogout = () => {
       if(user) {
         const stateToSave = { user, score, level, streak, events, eventCounts, unlockedAchievements, unlockedRewards };
         localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
       }
      setUser(null);
      setPage('login');
      setGameStats({ score: 0, level: 1, streak: 0 });
      setEvents([]);
      setEventCounts({ faults: 0, clears: 0 });
      setUnlockedAchievements([]);
      setUnlockedRewards([]);
      setLights(INITIAL_LIGHTS);
      lastKnownStates.current = {};
      if (isHardwareConnected) {
          disconnectSerial();
          setIsHardwareConnected(false);
      }
  };
  
  const handleToggleHardware = async () => {
    if (isHardwareConnected) {
      await disconnectSerial();
      setIsHardwareConnected(false);
      setLights(INITIAL_LIGHTS);
      lastKnownStates.current = {};
    } else {
      if (isConnecting) return;
      setIsConnecting(true);
      try {
        const success = await connectSerial(handleSerialData, handleUnexpectedDisconnect, baudRate);
        if (success) {
          setIsHardwareConnected(true);
          setLights(INITIAL_LIGHTS); // Reset lights on connect
          lastKnownStates.current = {};
          INITIAL_LIGHTS.forEach(light => {
            lastKnownStates.current[light.id] = light.state;
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('An unexpected error occurred while connecting to the hardware.');
        }
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage 
                  lights={lights} 
                  events={events} 
                  score={score} 
                  level={level} 
                  unlockedAchievements={unlockedAchievements} 
                  streak={streak}
                  highScores={highScores}
                  isHardwareConnected={isHardwareConnected}
                  theme={theme}
                />;
      case 'achievements':
        return <AchievementsPage allAchievements={ACHIEVEMENTS} unlockedAchievements={unlockedAchievements} />;
      case 'history':
        return <HistoryPage events={events} />;
      case 'profile':
        return <ProfilePage user={user || ''} score={score} level={level} highScores={highScores} unlockedAchievementsCount={unlockedAchievements.length} />;
      case 'rewards':
        return <RewardsPage allRewards={REWARDS} unlockedRewards={unlockedRewards} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  }

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 ${!audioReady && !user ? 'cursor-pointer' : ''}`} onClick={!audioReady && !user ? handleEnableAudio : undefined}>
        {!user ? (
            <LoginPage onLogin={handleLogin} />
        ) : (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <Navbar 
                    user={user} 
                    onNavigate={setPage}
                    onLogout={handleLogout}
                    activePage={page}
                    isHardwareConnected={isHardwareConnected}
                    isConnecting={isConnecting}
                    onToggleHardware={handleToggleHardware}
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                    baudRate={baudRate}
                    onBaudRateChange={setBaudRate}
                />
                <div className="mt-8">
                    {renderPage()}
                </div>
            </div>
        )}
      {showToast && <AchievementsToast achievement={showToast} />}
    </div>
  );
};

export default App;