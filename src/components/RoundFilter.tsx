import React from 'react';
import type { Round } from '../types';

interface RoundFilterProps {
  activeRound: Round | 'ALL';
  onChange: (round: Round | 'ALL') => void;
}

const ROUND_OPTIONS: Array<{ value: Round | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Rounds' },
  { value: 'ROUND_OF_32', label: 'Round of 32' },
  { value: 'ROUND_OF_16', label: 'Round of 16' },
  { value: 'QUARTER_FINAL', label: 'Quarter-finals' },
  { value: 'SEMI_FINAL', label: 'Semi-finals' },
  { value: 'FINAL', label: 'Final' },
];

export const RoundFilter: React.FC<RoundFilterProps> = ({ activeRound, onChange }) => {
  return (
    <div className="round-filter-container glass-panel">
      {ROUND_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`round-filter-btn ${activeRound === option.value ? 'is-active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
