import React, { useState, useMemo } from 'react';
import { Sparkles, ZoomIn, ZoomOut, Maximize2, RefreshCw, Circle, CheckCircle2 } from 'lucide-react';

export default function StateSpaceGraph({ graphData, currentStep, solutionPath }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  // Active state matching current step in simulation
  const activeStateId = currentStep ? `${currentStep.jug_a},${currentStep.jug_b}` : null;

  // Set of solution node IDs
  const solutionNodeIds = useMemo(() => {
    return new Set((solutionPath || []).map(s => `${s.jug_a},${s.jug_b}`));
  }, [solutionPath]);

  // Compute a simple radial or grid layout coordinates for nodes
  const layoutedNodes = useMemo(() => {
    if (!nodes.length) return [];
    
    // Group nodes by levels or lay them out systematically
    const width = 800;
    const height = 500;
    const padding = 60;
    
    // Determine unique x and y values for coordinates or distribute in a spiral/tree
    const total = nodes.length;
    const cols = Math.ceil(Math.sqrt(total * 1.5));
    const cellW = (width - padding * 2) / Math.max(1, cols);
    const cellH = (height - padding * 2) / Math.max(1, Math.ceil(total / cols));

    return nodes.map((node, index) => {
      // Find row and col
      const col = index % cols;
      const row = Math.floor(index / cols);
      // Add slight jitter for visual appeal
      const posX = padding + col * cellW + (row % 2 === 1 ? cellW * 0.25 : 0) + cellW / 2;
      const posY = padding + row * cellH + cellH / 2;

      return {
        ...node,
        posX,
        posY
      };
    });
  }, [nodes]);

  const nodePositionsMap = useMemo(() => {
    const map = {};
    layoutedNodes.forEach(n => {
      map[n.id] = { x: n.posX, y: n.posY };
    });
    return map;
  }, [layoutedNodes]);

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  if (!nodes.length) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400">
        <Sparkles className="w-8 h-8 text-cyan-500/40 mx-auto mb-2" />
        <p>No state space generated yet. Run a search simulation to explore the state-space graph.</p>
      </div>
    );
  }

  return (
    <div id="state-space" className="glass-panel p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">State Space Search Graph</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Live graph generated from backend search ({nodes.length} nodes, {edges.length} edges)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            Current
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            Solution Path
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            Goal
          </span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            Expanded
          </span>
        </div>

        {/* Zoom & Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setZoom(prev => Math.min(2.5, prev + 0.2))}
            title="Zoom In"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
            title="Zoom Out"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset View"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div 
        className="relative w-full h-[420px] bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Arrow marker for standard edges */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
            </marker>

            {/* Arrow marker for solution edges */}
            <marker
              id="arrow-solution"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Draw Edges */}
            {edges.map((edge) => {
              const srcPos = nodePositionsMap[edge.source];
              const tgtPos = nodePositionsMap[edge.target];
              if (!srcPos || !tgtPos) return null;

              const isSol = edge.is_solution;

              return (
                <g key={edge.id}>
                  <line
                    x1={srcPos.x}
                    y1={srcPos.y}
                    x2={tgtPos.x}
                    y2={tgtPos.y}
                    stroke={isSol ? '#10b981' : '#1e293b'}
                    strokeWidth={isSol ? 2.5 : 1.2}
                    strokeDasharray={isSol ? 'none' : '2,2'}
                    markerEnd={isSol ? 'url(#arrow-solution)' : 'url(#arrow)'}
                    className="transition-colors duration-300"
                  />
                </g>
              );
            })}

            {/* Draw Nodes */}
            {layoutedNodes.map((node) => {
              const isActive = node.id === activeStateId;
              const isSolution = solutionNodeIds.has(node.id);
              const isGoal = node.status === 'goal';
              const isInitial = node.status === 'initial';

              let fillColor = '#1e293b';
              let strokeColor = '#334155';
              let radius = 16;

              if (isActive) {
                fillColor = '#06b6d4';
                strokeColor = '#ffffff';
                radius = 22;
              } else if (isGoal) {
                fillColor = '#f59e0b';
                strokeColor = '#fef3c7';
                radius = 20;
              } else if (isSolution) {
                fillColor = '#10b981';
                strokeColor = '#6ee7b7';
                radius = 18;
              } else if (node.status === 'expanded') {
                fillColor = '#2563eb';
                strokeColor = '#60a5fa';
              } else if (isInitial) {
                fillColor = '#0891b2';
                strokeColor = '#22d3ee';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.posX}, ${node.posY})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                >
                  {/* Pulse ring for active node */}
                  {isActive && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={radius}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isActive || isGoal ? 3 : 1.5}
                    filter={isActive || isGoal ? 'url(#glow)' : 'none'}
                    className="transition-all duration-300 hover:scale-125"
                  />

                  {/* State Label (x, y) */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#ffffff"
                    fontSize={radius < 18 ? '9px' : '10px'}
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="pointer-events-none select-none"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Node Details Floating Overlay */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-200 shadow-xl backdrop-blur-md max-w-xs animate-in fade-in">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-cyan-400">State: ({selectedNode.jug_a}, {selectedNode.jug_b})</span>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                &times;
              </button>
            </div>
            <p className="text-[11px] text-slate-300">Heuristic: h(n) = {selectedNode.heuristic}</p>
            <p className="text-[11px] text-slate-400">Status: {selectedNode.status.toUpperCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
