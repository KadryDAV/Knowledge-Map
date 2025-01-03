import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
test('renders Navbar component', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const navbarElement = screen.getByRole('navigation');
  expect(navbarElement).toBeInTheDocument();
});

test('renders Home component on default route', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const homeElement = screen.getByText(/home/i);
  expect(homeElement).toBeInTheDocument();
});

test('renders Login component on /login route', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );
  const loginElement = screen.getByText(/login/i);
  expect(loginElement).toBeInTheDocument();
});

test('renders Signup component on /signup route', () => {
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <App />
    </MemoryRouter>
  );
  const signupElement = screen.getByText(/signup/i);
  expect(signupElement).toBeInTheDocument();
});

test('renders Profile component on /profile route', () => {
  render(
    <MemoryRouter initialEntries={['/profile']}>
      <App />
    </MemoryRouter>
  );
  const profileElement = screen.getByText(/profile/i);
  expect(profileElement).toBeInTheDocument();
});

test('renders MapViewer component on /map/:mapId route', () => {
  render(
    <MemoryRouter initialEntries={['/map/1']}>
      <App />
    </MemoryRouter>
  );
  const mapViewerElement = screen.getByText(/map viewer/i);
  expect(mapViewerElement).toBeInTheDocument();
});

test('renders MapEditor component on /map-editor/:mapId? route', () => {
  render(
    <MemoryRouter initialEntries={['/map-editor']}>
      <App />
    </MemoryRouter>
  );
  const mapEditorElement = screen.getByText(/map editor/i);
  expect(mapEditorElement).toBeInTheDocument();
});

test('renders BubbleMap component on /bubble-map route', () => {
  render(
    <MemoryRouter initialEntries={['/bubble-map']}>
      <App />
    </MemoryRouter>
  );
  const bubbleMapElement = screen.getByText(/bubble map/i);
  expect(bubbleMapElement).toBeInTheDocument();
});

test('renders AddTopic component on /add-topic/:mapId/:bubbleId route', () => {
  render(
    <MemoryRouter initialEntries={['/add-topic/1/1']}>
      <App />
    </MemoryRouter>
  );
  const addTopicElement = screen.getByText(/add topic/i);
  expect(addTopicElement).toBeInTheDocument();
});

test('renders TopicDetails component on /topic-details/:mapId/:bubbleId route', () => {
  render(
    <MemoryRouter initialEntries={['/topic-details/1/1']}>
      <App />
    </MemoryRouter>
  );
  const topicDetailsElement = screen.getByText(/topic details/i);
  expect(topicDetailsElement).toBeInTheDocument();
});
test('renders Navbar component', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const navbarElement = screen.getByRole('navigation');
  expect(navbarElement).toBeInTheDocument();
});

test('renders Home component on default route', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const homeElement = screen.getByText(/home/i);
  expect(homeElement).toBeInTheDocument();
});

test('renders Login component on /login route', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );
  const loginElement = screen.getByText(/login/i);
  expect(loginElement).toBeInTheDocument();
});

test('renders Signup component on /signup route', () => {
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <App />
    </MemoryRouter>
  );
  const signupElement = screen.getByText(/signup/i);
  expect(signupElement).toBeInTheDocument();
});

test('renders Profile component on /profile route', () => {
  render(
    <MemoryRouter initialEntries={['/profile']}>
      <App />
    </MemoryRouter>
  );
  const profileElement = screen.getByText(/profile/i);
  expect(profileElement).toBeInTheDocument();
});

test('renders MapViewer component on /map/:mapId route', () => {
  render(
    <MemoryRouter initialEntries={['/map/1']}>
      <App />
    </MemoryRouter>
  );
  const mapViewerElement = screen.getByText(/map viewer/i);
  expect(mapViewerElement).toBeInTheDocument();
});

test('renders MapEditor component on /map-editor/:mapId? route', () => {
  render(
    <MemoryRouter initialEntries={['/map-editor']}>
      <App />
    </MemoryRouter>
  );
  const mapEditorElement = screen.getByText(/map editor/i);
  expect(mapEditorElement).toBeInTheDocument();
});

test('renders BubbleMap component on /bubble-map route', () => {
  render(
    <MemoryRouter initialEntries={['/bubble-map']}>
      <App />
    </MemoryRouter>
  );
  const bubbleMapElement = screen.getByText(/bubble map/i);
  expect(bubbleMapElement).toBeInTheDocument();
});

test('renders AddTopic component on /add-topic/:mapId/:bubbleId route', () => {
  render(
    <MemoryRouter initialEntries={['/add-topic/1/1']}>
      <App />
    </MemoryRouter>
  );
  const addTopicElement = screen.getByText(/add topic/i);
  expect(addTopicElement).toBeInTheDocument();
});

test('renders TopicDetails component on /topic-details/:mapId/:bubbleId route', () => {
  render(
    <MemoryRouter initialEntries={['/topic-details/1/1']}>
      <App />
    </MemoryRouter>
  );
  const topicDetailsElement = screen.getByText(/topic details/i);
  expect(topicDetailsElement).toBeInTheDocument();
});

test('renders NotFound component on unmatched route', () => {
  render(
    <MemoryRouter initialEntries={['/some/random/path']}>
      <App />
    </MemoryRouter>
  );
  const notFoundElement = screen.getByText(/not found/i);
  expect(notFoundElement).toBeInTheDocument();
});
test('renders Navbar component', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const navbarElement = screen.getByRole('navigation');
  expect(navbarElement).toBeInTheDocument();
});

test('renders Home component on default route', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const homeElement = screen.getByText(/home/i);
  expect(homeElement).toBeInTheDocument();
});

test('renders Login component on /login route', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );
  const loginElement = screen.getByText(/login/i);
  expect(loginElement).toBeInTheDocument();
});

test('renders Signup component on /signup route', () => {
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <App />
    </MemoryRouter>
  );
  const signupElement = screen.getByText(/signup/i);
  expect(signupElement).toBeInTheDocument();
});

test('renders Profile component on /profile route', () => {
  render(
    <MemoryRouter initialEntries={['/profile']}>
      <App />
    </MemoryRouter>
  );
  const profileElement = screen.getByText(/profile/i);
  expect(profileElement).toBeInTheDocument();
});

test('renders MapViewer component on /map/:mapId route', () => {
  render(
    <MemoryRouter initialEntries={['/map/1']}>
      <App />
    </MemoryRouter>
  );
  const mapViewerElement = screen.getByText(/map viewer/i);
  expect(mapViewerElement).toBeInTheDocument();
});

test('renders MapEditor component on /map-editor/:mapId? route', () => {
  render(
    <MemoryRouter initialEntries={['/map-editor']}>
      <App />
    </MemoryRouter>
  );
  const mapEditorElement = screen.getByText(/map editor/i);
  expect(mapEditorElement).toBeInTheDocument();
});

test('renders BubbleMap component on /bubble-map route', () => {
  render(
    <MemoryRouter initialEntries={['/bubble-map']}>
      <App />
    </MemoryRouter>
  );
  const bubbleMapElement = screen.getByText(/bubble map/i);
  expect(bubbleMapElement).toBeInTheDocument();
});

test('renders AddTopic component on /add-topic/:mapId/:bubbleId route', () => {
  render(
    <MemoryRouter initialEntries={['/add-topic/1/1']}>
      <App />
    </MemoryRouter>
  );
  const addTopicElement = screen.getByText(/add topic/i);
  expect(addTopicElement).toBeInTheDocument();
});

test('renders TopicDetails component on /topic-details/:mapId/:bubbleId route', () => {
  render(
    <MemoryRouter initialEntries={['/topic-details/1/1']}>
      <App />
    </MemoryRouter>
  );
  const topicDetailsElement = screen.getByText(/topic details/i);
  expect(topicDetailsElement).toBeInTheDocument();
});

test('renders NotFound component on unmatched route', () => {
  render(
    <MemoryRouter initialEntries={['/some/random/path']}>
      <App />
    </MemoryRouter>
  );
  const notFoundElement = screen.getByText(/not found/i);
  expect(notFoundElement).toBeInTheDocument();
});