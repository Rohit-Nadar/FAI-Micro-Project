import React, { useState, useMemo } from 'react';
import { Sparkles, ZoomIn, ZoomOut, RefreshCw, LayoutGrid, Network } from 'lucide-react';

export default function StateSpaceGraph({ graphData, currentStep, solutionPath }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' (Lattice) or 'flow' (Tree)

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  // Active state matching current step in simulation
  const activeStateId = currentStep ? `${currentStep.jug_a},${currentStep.jug_b}` : null;

  // Set of solution node IDs
  const solutionNodeIds = useMemo(() => {
    return new Set((solutionPath || []).map(s => `${s.jug_a},${s.jug_b}`));
  }, [solutionPath]);

  // Max capacities from nodes for coordinate normalization
  const maxCapacities = useMemo(() => {
    let maxA = 1;
    let maxB = 1;
    nodes.forEach(n => {
      if (n.jug_a > maxA) maxA = n.jug_a;
      if (n.jug_b > maxB) maxB = n.jug_b;
    });
    return { maxA, maxB };
  }, [nodes]);

  // Compute node coordinates based on active layout mode
  const layoutedNodes = useMemo(() => {
    if (!nodes.length) return [];
    
    const width = 800;
    const height = 480;
    const paddingX = 80;
    const paddingY = 60;

    if (layoutMode === 'grid') {
      // 2D State-Space Lattice: X-axis = Jug A, Y-axis = Jug B
      const availableW = width - paddingX * 2;
      const availableH = height - paddingY * 2;

      return nodes.map((node) => {
        const normX = node.jug_a / Math.max(1, maxCapacities.maxA);
        const normY = node.jug_b / Math.max(1, maxCapacities.maxB);

        // Invert Y so 0L is at bottom
        const posX = paddingX + normX * availableW;
        const posY = height - (paddingY + normY * availableH);

        return {
          ...node,
          posX,
          posY
        };
      });
    } else {
      // Exploration Sequence Flow
      const total = nodes.length;
      const cols = Math.ceil(Math.sqrt(total * 1.6));
      const cellW = (width - paddingX * 2) / Math.max(1, cols);
      const cellH = (height - paddingY * 2) / Math.max(1, Math.ceil(total / cols));

      return nodes.map((node, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const posX = paddingX + col * cellW + (row % 2 === 1 ? cellW * 0.2 : 0) + cellW / 2;
        const posY = paddingY + row * cellH + cellH / 2;

        return {
          ...node,
          posX,
          posY
        };
      });
    }
  }, [nodes, layoutMode, maxCapacities]);

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
              {nodes.length} nodes &bull; {edges.length} directed transitions
            </p>
          </div>
        </div>

        {/* Layout Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              layoutMode === 'grid' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>2D Lattice</span>
          </button>
          <button
            onClick={() => setLayoutMode('flow')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              layoutMode === 'flow' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Tree Flow</span>
          </button>
        </div>

        {/* Zoom & Reset Controls */}
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
        {/* Lattice Coordinate Axes Labels */}
        {layoutMode === 'grid' && (
          <>
            <div className="absolute bottom-2 right-4 text-[10px] font-mono text-cyan-400/60 pointer-events-none">
              &rarr; Jug A Quantity (L)
            </div>
            <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/60 pointer-events-none">
              &uarr; Jug B Quantity (L)
            </div>
          </>
        )}

        <svg
          className="w-full h-full"
          viewBox="0 0 800 480"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
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
                    strokeWidth={isSol ? 2.8 : 1.2}
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
          <div className="absolute bottom-3 left-3 p-3 rounded-xl bg-slate-900/95 border border-slate-700 text-xs font-mono text-slate-200 shadow-xl backdrop-blur-md max-w-xs animate-in fade-in">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-cyan-400">State: ({selectedNode.jug_a}, {selectedNode.jug_b})</span>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                &times;
              </button>
            </div>
            <p className="text-[11px] text-slate-300">Heuristic: h(x,y) = {selectedNode.heuristic}</p>
            <p className="text-[11px] text-slate-400">Status: {selectedNode.status.toUpperCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
