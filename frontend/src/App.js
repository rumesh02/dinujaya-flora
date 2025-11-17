import React from 'react';
import Navbar from './components/Navbar';
import HeroSlideshow from './components/HeroSlideshow';
import Features from './components/Features';
import PopularBouquets from './components/PopularBouquets';
import Occasions from './components/Occasions';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSlideshow />
      <Features />
      <PopularBouquets />
      <Occasions />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default App;
