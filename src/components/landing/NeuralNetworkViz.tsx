import { useEffect, useRef } from "react";

const LAYERS = [4, 6, 8, 6, 4];
const NEURON_R = 12;
const LAYER_GAP = 180;
const NEURON_GAP = 50;
const WIDTH = (LAYERS.length - 1) * LAYER_GAP + 120;
const HEIGHT = Math.max(...LAYERS) * NEURON_GAP + 60;

// Full rainbow spectrum (HSL hues 0..360, every 15°)
const RAINBOW = Array.from({ length: 24 }, (_, i) => `hsl(${i * 15}, 100%, 60%)`);
const hueFor = (i: number) => RAINBOW[((i % RAINBOW.length) + RAINBOW.length) % RAINBOW.length];

const colors = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--primary))",
];

interface Pos { x: number; y: number; color: string }

const getPositions = (): Pos[][] =>
  LAYERS.map((count, li) => {
    const x = 60 + li * LAYER_GAP;
    const totalH = (count - 1) * NEURON_GAP;
    const startY = (HEIGHT - totalH) / 2;
    return Array.from({ length: count }, (_, ni) => ({
      x,
      y: startY + ni * NEURON_GAP,
      color: colors[li],
    }));
  });

const NeuralNetworkViz = () => {
  const positions = getPositions();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = svgRef.current;
    if (!svg || prefersReduced) return;

    // Build lookup maps
    const getLinesBetween = (li: number, fi: number, ti: number) =>
      svg.querySelector<SVGLineElement>(`.nn-conn[data-from="${li}-${fi}"][data-to="${li + 1}-${ti}"]`);

    const getNeuron = (nid: string) => ({
      glow: svg.querySelector<SVGCircleElement>(`.nn-glow[data-nid="${nid}"]`),
      core: svg.querySelector<SVGCircleElement>(`.nn-core[data-nid="${nid}"]`),
      dot: svg.querySelector<SVGCircleElement>(`.nn-dot[data-nid="${nid}"]`),
    });

    const activateNeuron = (nid: string, color: string) => {
      const n = getNeuron(nid);
      if (!n.glow) return;
      n.glow!.style.fill = color;
      n.glow!.style.opacity = "0.55";
      n.core!.style.stroke = color;
      n.core!.style.strokeWidth = "3";
      n.dot!.style.fill = color;
      n.dot!.style.opacity = "1";
    };

    const deactivateNeuron = (nid: string, origColor: string) => {
      const n = getNeuron(nid);
      if (!n.glow) return;
      n.glow!.style.fill = origColor;
      n.glow!.style.opacity = "0.15";
      n.core!.style.stroke = origColor;
      n.core!.style.strokeWidth = "2";
      n.dot!.style.fill = origColor;
      n.dot!.style.opacity = "0.7";
    };

    const activateLine = (line: SVGLineElement, color: string) => {
      line.style.opacity = "0.85";
      line.style.strokeWidth = "2.5";
      line.style.stroke = color;
    };

    const deactivateLine = (line: SVGLineElement) => {
      line.style.opacity = "0.4";
      line.style.strokeWidth = "1";
      line.style.stroke = line.dataset.origcolor!;
    };

    let timeout: number;
    let cancelled = false;

    // Helper: pick N random unique indices from [0..max)
    const pickRandom = (max: number, count: number) => {
      const all = Array.from({ length: max }, (_, i) => i);
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      return all.slice(0, Math.min(count, max));
    };

    // Spread the layers across the full spectrum so a single wave shows the entire rainbow,
    // then advance the offset each pass so the palette continuously cycles.
    const HUE_STEP = Math.floor(RAINBOW.length / LAYERS.length); // ≈ 4 with 24 hues / 5 layers
    let waveOffset = 0;
    const runForwardPass = () => {
      if (cancelled) return;
      const startHue = waveOffset;
      waveOffset = (waveOffset + 1) % RAINBOW.length;

      // Build activation map: which neurons are active per layer
      // Layer 0: ALL 4 input neurons fire
      const activePerLayer: number[][] = [];
      activePerLayer[0] = Array.from({ length: LAYERS[0] }, (_, i) => i);

      // Hidden layers: random subset activates (40-70% of neurons)
      for (let li = 1; li < LAYERS.length - 1; li++) {
        const minActive = Math.max(2, Math.floor(LAYERS[li] * 0.4));
        const maxActive = Math.ceil(LAYERS[li] * 0.7);
        const count = minActive + Math.floor(Math.random() * (maxActive - minActive + 1));
        activePerLayer[li] = pickRandom(LAYERS[li], count);
      }

      // Output layer: exactly 1 neuron activates
      activePerLayer[LAYERS.length - 1] = [Math.floor(Math.random() * LAYERS[LAYERS.length - 1])];

      const STEP_DELAY = 350;
      const HOLD = 600;

      // Track all elements to deactivate at the end
      const toDeactivate: { nid: string; layer: number; line?: SVGLineElement }[] = [];

      // Animate layer by layer — each layer gets a different rainbow hue (full spectrum across the network)
      activePerLayer.forEach((activeNeurons, li) => {
        const delay = li * STEP_DELAY;
        const neuronColor = hueFor(startHue + li * HUE_STEP);
        const lineColor = hueFor(startHue + (li - 1) * HUE_STEP + Math.floor(HUE_STEP / 2));

        setTimeout(() => {
          if (cancelled) return;

          activeNeurons.forEach((ni) => {
            const nid = `${li}-${ni}`;
            activateNeuron(nid, neuronColor);
            toDeactivate.push({ nid, layer: li });
          });

          if (li > 0) {
            const prevActive = activePerLayer[li - 1];
            prevActive.forEach((fi) => {
              activeNeurons.forEach((ti) => {
                const line = getLinesBetween(li - 1, fi, ti);
                if (line) {
                  activateLine(line, lineColor);
                  toDeactivate.push({ nid: "", layer: li, line });
                }
              });
            });
          }
        }, delay);
      });

      // Deactivate everything after the wave completes
      const totalSteps = activePerLayer.length * STEP_DELAY;
      setTimeout(() => {
        if (cancelled) return;
        toDeactivate.forEach(({ nid, layer, line }) => {
          if (line) {
            deactivateLine(line);
          } else {
            deactivateNeuron(nid, colors[layer]);
          }
        });
      }, totalSteps + HOLD);

      // Schedule next forward pass
      timeout = window.setTimeout(runForwardPass, totalSteps + HOLD + 400 + Math.random() * 600);
    };

    runForwardPass();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full max-w-3xl mx-auto opacity-60 hover:opacity-90 transition-opacity duration-500"
      aria-hidden="true"
    >
      {positions.slice(0, -1).map((layer, li) =>
        layer.map((from, fi) =>
          positions[li + 1].map((to, ti) => (
            <line
              key={`${li}-${fi}-${ti}`}
              className="nn-conn"
              data-from={`${li}-${fi}`}
              data-to={`${li + 1}-${ti}`}
              data-origcolor={from.color}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={from.color}
              strokeWidth="1"
              opacity="0.4"
              style={{ transition: "opacity 0.3s, stroke-width 0.3s, stroke 0.3s" }}
            />
          ))
        )
      )}

      {positions.map((layer, li) =>
        layer.map((n, ni) => {
          const nid = `${li}-${ni}`;
          return (
            <g key={nid}>
              <circle
                className="nn-glow"
                data-nid={nid}
                data-origcolor={n.color}
                cx={n.x}
                cy={n.y}
                r={NEURON_R + 5}
                fill={n.color}
                opacity="0.15"
                style={{ transition: "fill 0.3s, opacity 0.3s" }}
              />
              <circle
                className="nn-core"
                data-nid={nid}
                cx={n.x}
                cy={n.y}
                r={NEURON_R}
                fill="hsl(var(--background))"
                stroke={n.color}
                strokeWidth="2"
                style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              />
              <circle
                className="nn-dot"
                data-nid={nid}
                cx={n.x}
                cy={n.y}
                r={4}
                fill={n.color}
                opacity="0.7"
                style={{ transition: "fill 0.3s, opacity 0.3s" }}
              />
            </g>
          );
        })
      )}
    </svg>
  );
};

export default NeuralNetworkViz;
