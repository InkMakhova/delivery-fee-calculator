import App from './app';
import { render } from "@testing-library/react";

it('should render App correctly', () => {
  const {container} = render(<App />);

  expect(container).toMatchSnapshot();
});
