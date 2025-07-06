import { render } from "@testing-library/react";
import App from "./App";
import AddCar from "./components/AddCar";

test("open add car modal form", () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});


test('matches snapshot', () => {
  const { asFragment } = render(<AddCar />);
  expect(asFragment()).toMatchSnapshot();
});

/*test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/carshop/i);
  expect(linkElement).toBeInTheDocument();
});
*/
