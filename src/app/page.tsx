import Hero from '../../modules/web/Hero';
import LoadingScreen from '../../modules/web/LoadingScreen';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white text-black">
      {/* Engaging Green Lemon Loading Screen */}
      <LoadingScreen />

      {/* Hero Page Placeholder */}
      <Hero />
    </main>
  );
}
