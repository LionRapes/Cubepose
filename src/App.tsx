import { Canvas } from '@react-three/fiber';
import { Background } from './components/Background';
import { GameScene } from './components/GameScene';

export default function App() {
  return (
    <Canvas gl={{stencil: true}}>
      <color attach="background" args={['#000000']} />

      <Background/>
      <GameScene />
    </Canvas>
  );
}

