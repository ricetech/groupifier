import React from 'react';
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import { Participant } from '../../interfaces';

const name = [
  { value: 'student1', label: 'Bob' },
  { value: 'student2', label: 'Bobby' },
];

interface TeamCardProps {
  teamCardOption: String;
  data: Participant[];
}

export const TeamCard: React.FC<TeamCardProps> = ({ teamCardOption, data }) => (
  <div className='team-card'>
    <Row>
      <img src='' />
      <h1 className='team-title'>Build Your</h1>
      <p className='team-option'>{teamCardOption}</p>
    </Row>
    <Row>
      <Select
        isMulti
        className='basic-multi-select'
        classNamePrefit='select'
        options={data}
      />
    </Row>
  </div>
);
