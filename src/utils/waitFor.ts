export function waitFor(
  checkFn: () => boolean,
  timeoutMs: number = 500
): Promise<boolean> {
  return new Promise((resolve) => {
    const start = performance.now();
    
    function tick() {
      if (checkFn()) 
        return resolve(true);
      
      if (performance.now() - start >= timeoutMs)
        return resolve(false);

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}