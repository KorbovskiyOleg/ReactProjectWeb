/*import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/carshop/i);
  expect(linkElement).toBeInTheDocument();
});
*/
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("open add car modal form", () => {
  render(<App />);
  fireEvent.click(screen.getByText("New Car"));
  expect(screen.getByRole("dialog")).toHaveTextContent("New car");
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/carshop/i);
  expect(linkElement).toBeInTheDocument();
});
