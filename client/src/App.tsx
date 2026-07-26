import { Canvas } from '@react-three/fiber';
import { Background } from './components/Background';
import { OrthographicCamera } from '@react-three/drei';


export default function App() {
  return (
    <Canvas>
      <OrthographicCamera 
        makeDefault 
        position={[0, 0, 1]} 
        zoom={1}
      />
      <Background />
    </Canvas>
  );
}

