import { MemoryCarousel } from './components/MemoryCarousel';
import './App.css'

function App() {

  return (
    <>
      <div className="relative flex flex-col gap-10 overflow-hidden bg-[#1F1F1F] py-20 transition-all duration-300 ease-in-out md:py-30 xl:gap-16">
        <MemoryCarousel />
      </div>
    </>
  )
}

export default App
