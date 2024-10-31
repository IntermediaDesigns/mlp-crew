import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard';
import Characters from './pages/characters';
import CharacterDetail from './pages/characters/[id]';
import Episodes from './pages/episodes';
import EpisodeDetail from './pages/episodes/[id]';
import Songs from './pages/songs';
import SongDetail from './pages/songs/[id]';
import Search from './pages/search';
import Ponies from './pages/ponies';
import NewPony from './pages/ponies/new';
import PonyDetail from './pages/ponies/[id]';
import EditPony from './pages/ponies/edit';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
        <Route path="/episodes" element={<Episodes />} />
        <Route path="/episodes/:id" element={<EpisodeDetail />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/songs/:id" element={<SongDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/ponies" element={<Ponies />} />
        <Route path="/ponies/new" element={<NewPony />} />
        <Route path="/ponies/:id" element={<PonyDetail />} />
        <Route path="/ponies/:id/edit" element={<EditPony />} />
      </Route>
    </Routes>
  );
}

export default App;
