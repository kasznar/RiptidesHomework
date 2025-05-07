import styled from "styled-components";

export const Button = styled.button`
  background-color: ${(p) => (p.disabled ? "gray" : "#161616")};
  border-radius: 0;
  color: white;
  border: none;
  font: inherit;
  font-size: 1.5rem;
  padding: 10px 20px;
  cursor: pointer;
`;
