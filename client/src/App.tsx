import { Canvas } from '@react-three/fiber';
import { Background } from './components/Background';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { CubeContainer } from './components/CubeContainer';

export default function App() {
  return (
    <Canvas gl={{stencil: true}}>
      <color attach="background" args={['#000000']} />
      <OrthographicCamera 
        makeDefault 
        position={[10, 10, 10]} 
        zoom={40}
      />
      <OrbitControls />

      <Background/>
      <CubeContainer />
    </Canvas>
  );
}

