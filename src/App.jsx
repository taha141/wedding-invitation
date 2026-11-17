import Envelope from './components/Envelope';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Intro from './components/Intro';
import CoupleScene from './components/CoupleScene';

function StoryPage() {
  return (
    <main>
      <Intro />
      <CoupleScene />
    </main>
  );
}

// function InvitationPage() {
//   return (
//     <main>
//       <h1>Invitation Page</h1>
//     </main>
//   );
// }
function InvitationPage() {
  return <Envelope />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StoryPage />} />
        <Route path="/invitation" element={<InvitationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
