import { ChangeEvent } from "react";
import styled from "styled-components";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

export const Input = (props: InputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };

  return <StyledInput value={props.value} onChange={handleChange} />;
};

const StyledInput = styled.input`
  padding: 0.5rem 0.75rem;
  min-height: 2.75rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  height: auto;
  border-radius: 0;
  border: none;
`;
