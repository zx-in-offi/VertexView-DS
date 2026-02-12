import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { hierarchy, tree as d3tree } from 'd3-hierarchy';
import { TreePine } from 'lucide-react';
import { Typography } from '@mui/material';

const NODE_RADIUS = 22;
const LEVEL_HEIGHT = 80;
const NODE_SPACING = 50;

/** Convert our AVL JSON into a d3-hierarchy-compatible structure */
function toHierarchy(node) {
    if (!node) return null;
    const children = [];
    if (node.left) children.push(toHierarchy(node.left));
    if (node.right) children.push(toHierarchy(node.right));

    // If a node only has a right child, insert a phantom left child to preserve layout
    if (!node.left && node.right) {
        children.unshift({ key: '__phantom__', bf: 0, children: [] });
    }
    if (node.left && !node.right) {
        children.push({ key: '__phantom__', bf: 0, children: [] });
    }

    return { key: node.key, bf: node.bf, children };
}

export default function TreeCanvas({ tree, highlight }) {
    const svgRef = useRef(null);

    // Pan & zoom state
    const [viewBox, setViewBox] = useState({ x: -400, y: -40, w: 800, h: 600 });
    const dragRef = useRef(null);

    // ── Compute layout ────────────────────────

    const nodes = useMemo(() => {
        if (!tree) return [];

        const root = toHierarchy(tree);
        const h = hierarchy(root, (d) => (d.children && d.children.length ? d.children : null));

        const layoutFn = d3tree()
            .nodeSize([NODE_SPACING, LEVEL_HEIGHT])
            .separation((a, b) => (a.parent === b.parent ? 1.2 : 1.8));

        layoutFn(h);

        const result = [];
        h.each((d) => {
            if (d.data.key === '__phantom__') return; // skip phantom nodes
            result.push({
                key: d.data.key,
                bf: d.data.bf,
                x: d.x,
                y: d.y,
                parentX: d.parent ? d.parent.x : null,
                parentY: d.parent ? d.parent.y : null,
                isPhantomParent: false,
            });
        });

        return result;
    }, [tree]);

    // ── Pan ────────────────────────────────────

    const handleMouseDown = useCallback(
        (e) => {
            if (e.button !== 0) return;
            dragRef.current = { startX: e.clientX, startY: e.clientY, vb: { ...viewBox } };
        },
        [viewBox],
    );

    const handleMouseMove = useCallback((e) => {
        if (!dragRef.current) return;
        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const scaleX = dragRef.current.vb.w / rect.width;
        const scaleY = dragRef.current.vb.h / rect.height;

        const dx = (e.clientX - dragRef.current.startX) * scaleX;
        const dy = (e.clientY - dragRef.current.startY) * scaleY;

        setViewBox({
            ...dragRef.current.vb,
            x: dragRef.current.vb.x - dx,
            y: dragRef.current.vb.y - dy,
        });
    }, []);

    const handleMouseUp = useCallback(() => {
        dragRef.current = null;
    }, []);

    // ── Zoom ───────────────────────────────────

    const handleWheel = useCallback(
        (e) => {
            e.preventDefault();
            const factor = e.deltaY > 0 ? 1.1 : 0.9;
            setViewBox((vb) => {
                const newW = vb.w * factor;
                const newH = vb.h * factor;
                return {
                    x: vb.x + (vb.w - newW) / 2,
                    y: vb.y + (vb.h - newH) / 2,
                    w: newW,
                    h: newH,
                };
            });
        },
        [],
    );

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        svg.addEventListener('wheel', handleWheel, { passive: false });
        return () => svg.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // ── Render ─────────────────────────────────

    if (!tree) {
        return (
            <div className="empty-state">
                <TreePine size={64} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 500 }}>No tree yet</Typography>
                <Typography variant="body2">Enter some integers and click Visualize</Typography>
            </div>
        );
    }

    return (
        <svg
            ref={svgRef}
            className="tree-svg"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id="edgeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c4dff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#448aff" stopOpacity="0.2" />
                </linearGradient>
            </defs>

            {/* Edges */}
            {nodes.map(
                (n) =>
                    n.parentX !== null && (
                        <line
                            key={`edge-${n.key}`}
                            className="tree-edge"
                            x1={n.parentX}
                            y1={n.parentY}
                            x2={n.x}
                            y2={n.y}
                            stroke="url(#edgeGrad)"
                        />
                    ),
            )}

            {/* Nodes */}
            {nodes.map((n) => {
                const isHighlighted = highlight === n.key;
                const bfClass = `bf-${n.bf}`;

                return (
                    <g
                        key={`node-${n.key}`}
                        className={`tree-node ${bfClass} ${isHighlighted ? 'node-highlight' : ''}`}
                    >
                        <circle cx={n.x} cy={n.y} r={NODE_RADIUS} strokeWidth={2.5} />
                        <text
                            x={n.x}
                            y={n.y + 1}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={13}
                            fill="#fff"
                        >
                            {n.key}
                        </text>
                        {/* Small BF label */}
                        <text
                            x={n.x + NODE_RADIUS + 6}
                            y={n.y - NODE_RADIUS + 6}
                            fontSize={9}
                            fill="rgba(179,136,255,0.7)"
                            fontFamily="'JetBrains Mono', monospace"
                        >
                            {n.bf > 0 ? `+${n.bf}` : n.bf}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
