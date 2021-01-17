import React, { useEffect, useState } from 'react';
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
  setTeam: React.Dispatch<React.SetStateAction<Participant[]>>;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  teamCardOption,
  data,
  setTeam,
}) => {
  // const [team, setTeam] = useState<Participant[]>([]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleChange = (
    selection: IterableIterator<Participant> | undefined
  ) => {
    if (selection) {
      setTeam(Array.from(selection));
    }
  };
  return (
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
          onChange={(selected) => {
            handleChange(selected?.values());
          }}
        />
      </Row>
    </div>
  );
};
