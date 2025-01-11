import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trophy, Medal, Star, Search, BarChart3, X, ArrowUpDown } from 'lucide-react';

// PlayerStats Modal Component
const PlayerStats = ({ onClose, entries = [] }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'points',
    direction: 'desc'
  });
  const [positionFilter, setPositionFilter] = useState('ALL');

  const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DEFENSE', 'COACH'];

  // Normalize position by removing numbers
  const normalizePosition = (pos) => {
    if (!pos) return '';
    // Convert to lowercase and remove any numbers
    return pos.toLowerCase().replace(/[0-9]/g, '');
  };

  // Safely flatten all players from entries and deduplicate
  const allPlayers = entries.reduce((acc, entry) => {
    if (!entry || !Array.isArray(entry.roster)) return acc;

    entry.roster.forEach(player => {
      if (!player) return;

      const normalizedPos = normalizePosition(player.position);
      const key = `${player.name}-${normalizedPos}`;

      // Only add if we haven't seen this player-position combination
      if (!acc.some(p =>
        p.name === player.name &&
        normalizePosition(p.position) === normalizedPos
      )) {
        acc.push({
          ...player,
          position: normalizedPos
        });
      }
    });

    return acc;
  }, []);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'desc'
          ? 'asc'
          : 'desc'
    });
  };

  const sortedPlayers = [...allPlayers].sort((a, b) => {
    const aValue = (a?.[sortConfig.key] ?? 0);
    const bValue = (b?.[sortConfig.key] ?? 0);
    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const filteredPlayers = positionFilter === 'ALL'
    ? sortedPlayers
    : sortedPlayers.filter(player =>
        normalizePosition(player?.position) === positionFilter.toLowerCase()
      );

  // Early return if no entries provided
  if (!Array.isArray(entries) || entries.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">Player Statistics</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 text-center">
            No player data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Player Statistics</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-auto">
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {positions.map(pos => (
                <button
                  key={pos}
                  onClick={() => setPositionFilter(pos)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    positionFilter === pos
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3">Player</th>
                    <th className="p-3">Pos</th>
                    <th className="p-3 cursor-pointer" onClick={() => handleSort('points')}>
                      <div className="flex items-center gap-1">
                        Total Pts
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    {positionFilter !== 'defense' && (
                      <>
                        <th className="p-3">Pass TD</th>
                        <th className="p-3">Pass Yds</th>
                        <th className="p-3">Rush TD</th>
                        <th className="p-3">Rush Yds</th>
                        <th className="p-3">Rec TD</th>
                        <th className="p-3">Rec Yds</th>
                      </>
                    )}
                    {positionFilter === 'defense' && (
                      <>
                        <th className="p-3">Points Against</th>
                        <th className="p-3">Sacks</th>
                        <th className="p-3">INT</th>
                        <th className="p-3">Fumbles</th>
                        <th className="p-3">Safety</th>
                      </>
                    )}
                    <th className="p-3 cursor-pointer" onClick={() => handleSort('bonus_points')}>
                      <div className="flex items-center gap-1">
                        Bonus
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{player?.name || '-'}</td>
                      <td className="p-3">{player?.position?.toUpperCase() || '-'}</td>
                      <td className="p-3 font-bold">{player?.points?.toFixed(1) || '-'}</td>
                      {positionFilter !== 'defense' && (
                        <>
                          <td className="p-3">{player?.pass_td ?? '-'}</td>
                          <td className="p-3">{player?.pass_yds?.toFixed(1) ?? '-'}</td>
                          <td className="p-3">{player?.rush_td ?? '-'}</td>
                          <td className="p-3">{player?.rush_yds?.toFixed(1) ?? '-'}</td>
                          <td className="p-3">{player?.rec_td ?? '-'}</td>
                          <td className="p-3">{player?.rec_yds?.toFixed(1) ?? '-'}</td>
                        </>
                      )}
                      {positionFilter === 'defense' && (
                        <>
                          <td className="p-3">{player?.score_allowed_points ?? '-'}</td>
                          <td className="p-3">{player?.score_sack_points ?? '-'}</td>
                          <td className="p-3">{player?.score_interception_points ?? '-'}</td>
                          <td className="p-3">{player?.score_fumble_points ?? '-'}</td>
                          <td className="p-3">{player?.score_safety_points ?? '-'}</td>
                        </>
                      )}
                      <td className="p-3">{player?.bonus_points?.toFixed(1) ?? '-'}</td>
                      <td className="p-3">
                        {player?.isActive ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          <span className="text-red-500">Eliminated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main PlayoffLeaderboard Component
const PlayoffLeaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEntries, setExpandedEntries] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showingStats, setShowingStats] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/leaderboard.json');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        setEntries(data.entries);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleEntry = (id) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Filter entries based on search term
  const filteredEntries = entries.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort entries by total points (descending)
  const sortedEntries = [...filteredEntries].sort((a, b) => b.totalPoints - a.totalPoints);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-center mb-4">
          NFL Playoff Pool Leaderboard
        </h1>
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Find your entry..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowingStats(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Player Stats</span>
          </button>
        </div>
      </div>

      {/* Entries */}
      {sortedEntries.map((entry, index) => (
        <div key={entry.id} className="bg-white rounded-lg shadow">
          <div
            className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50"
            onClick={() => toggleEntry(entry.id)}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {index === 0 && <Trophy className="text-yellow-500 w-6 h-6" title="1st Place" />}
                {index === 1 && <Medal className="text-gray-400 w-6 h-6" title="2nd Place" />}
                {index === 2 && <Medal className="text-amber-600 w-6 h-6" title="3rd Place" />}
                {index === 3 && <Star className="text-blue-400 w-6 h-6" title="4th Place" />}
                <span className="font-bold text-xl">#{index + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{entry.name}</h3>
                <div className="text-sm text-gray-600">
                  {entry.playersRemaining} players remaining
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-bold text-xl">{entry.totalPoints.toFixed(1)}</div>
                <div className="text-sm text-gray-600">points</div>
              </div>
              {expandedEntries.has(entry.id) ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </div>
          </div>

          {expandedEntries.has(entry.id) && (
            <div className="bg-gray-50 p-4 border-t">
              <div className="grid grid-cols-1 gap-4">
                {entry.roster.map((player, playerIndex) => (
                  <div
                    key={playerIndex}
                    className="flex items-center justify-between p-3 rounded bg-white shadow-sm"
                  >
                    <div>
                      <div className="text-sm text-gray-600">{player.position}</div>
                      <div className="font-medium">
                        {player.name}
                        {!player.isActive && (
                          <span className="text-red-500 text-sm ml-2">eliminated</span>
                        )}
                      </div>
                    </div>
                    <div className="font-bold">{player.points.toFixed(1)} pts</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Player Stats Modal */}
      {showingStats && <PlayerStats onClose={() => setShowingStats(false)} entries={entries} />}
    </div>
  );
};

export default PlayoffLeaderboard;