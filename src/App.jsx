import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { createAVL } from './avl/avlTree';
import Sidebar from './components/Sidebar';
import TreeCanvas from './components/TreeCanvas';
import StepControls from './components/StepControls';

export default function App() {
    const avlRef = useRef(createAVL());

    const [tree, setTree] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const [statusText, setStatusText] = useState('');

    // Step-by-step mode
    const [stepMode, setStepMode] = useState(false);
    const [steps, setSteps] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const [speed, setSpeed] = useState(600); // ms per step

    // ── Helpers ────────────────────────────────

    const applySnapshots = useCallback(
        (snapshots) => {
            if (stepMode && snapshots.length > 1) {
                setSteps(snapshots);
                setStepIndex(0);
                setTree(snapshots[0].tree);
                setHighlight(snapshots[0].highlight ?? null);
                setStatusText(snapshots[0].label);
                setIsPlaying(false);
            } else {
                // Auto-play all steps
                const last = snapshots[snapshots.length - 1];
                snapshots.forEach((snap, i) => {
                    setTimeout(() => {
                        setTree(snap.tree);
                        setHighlight(snap.highlight ?? null);
                        setStatusText(snap.label);
                    }, i * speed);
                });
                // Clear highlight after last
                setTimeout(() => setHighlight(null), snapshots.length * speed + 400);
            }
        },
        [stepMode, speed],
    );

    // ── Actions ────────────────────────────────

    const handleInsert = useCallback(
        (key) => {
            const num = parseInt(key, 10);
            if (isNaN(num)) return;
            const { snapshots } = avlRef.current.insert(num);
            applySnapshots(snapshots);
        },
        [applySnapshots],
    );

    const handleDelete = useCallback(
        (key) => {
            const num = parseInt(key, 10);
            if (isNaN(num)) return;
            const { snapshots } = avlRef.current.remove(num);
            applySnapshots(snapshots);
        },
        [applySnapshots],
    );

    const handleVisualize = useCallback(
        (text) => {
            avlRef.current.clear();
            const keys = text
                .split(/[,\s]+/)
                .map((s) => parseInt(s.trim(), 10))
                .filter((n) => !isNaN(n));

            if (keys.length === 0) return;

            // Collect all snapshots across all inserts
            const allSnapshots = [];
            keys.forEach((k) => {
                const { snapshots } = avlRef.current.insert(k);
                allSnapshots.push(...snapshots);
            });

            applySnapshots(allSnapshots);
        },
        [applySnapshots],
    );

    const handleClear = useCallback(() => {
        avlRef.current.clear();
        setTree(null);
        setHighlight(null);
        setStatusText('');
        setSteps([]);
        setStepIndex(0);
    }, []);

    // ── Step navigation ────────────────────────

    const goToStep = useCallback(
        (idx) => {
            if (idx < 0 || idx >= steps.length) return;
            setStepIndex(idx);
            setTree(steps[idx].tree);
            setHighlight(steps[idx].highlight ?? null);
            setStatusText(steps[idx].label);
        },
        [steps],
    );

    // Auto-play in step mode
    useEffect(() => {
        if (!isPlaying || steps.length === 0) return;
        const timer = setInterval(() => {
            setStepIndex((prev) => {
                const next = prev + 1;
                if (next >= steps.length) {
                    setIsPlaying(false);
                    clearInterval(timer);
                    return prev;
                }
                setTree(steps[next].tree);
                setHighlight(steps[next].highlight ?? null);
                setStatusText(steps[next].label);
                return next;
            });
        }, speed);
        return () => clearInterval(timer);
    }, [isPlaying, steps, speed]);

    // ── Render ─────────────────────────────────

    return (
        <Box className="app-root">
            <Sidebar
                onInsert={handleInsert}
                onDelete={handleDelete}
                onVisualize={handleVisualize}
                onClear={handleClear}
                speed={speed}
                onSpeedChange={setSpeed}
                stepMode={stepMode}
                onStepModeChange={setStepMode}
            />

            <Box className="main-canvas">
                {statusText && <div className="status-chip">{statusText}</div>}

                <TreeCanvas tree={tree} highlight={highlight} />

                {stepMode && steps.length > 1 && (
                    <StepControls
                        stepIndex={stepIndex}
                        totalSteps={steps.length}
                        isPlaying={isPlaying}
                        onPrev={() => goToStep(stepIndex - 1)}
                        onNext={() => goToStep(stepIndex + 1)}
                        onPlayPause={() => setIsPlaying((p) => !p)}
                    />
                )}
            </Box>
        </Box>
    );
}
