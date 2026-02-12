import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Slider,
    Switch,
    FormControlLabel,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    TreePine,
    Plus,
    Trash2,
    Eraser,
    Play,
    Gauge,
    Footprints,
} from 'lucide-react';

export default function Sidebar({
    onInsert,
    onDelete,
    onVisualize,
    onClear,
    speed,
    onSpeedChange,
    stepMode,
    onStepModeChange,
}) {
    const [inputText, setInputText] = useState('');
    const [singleKey, setSingleKey] = useState('');
    const [deleteKey, setDeleteKey] = useState('');

    return (
        <Box className="sidebar">
            {/* ── Logo ────────────────────────────── */}
            <Box className="sidebar-logo">
                <TreePine size={28} color="#7c4dff" />
                <Typography variant="h6" sx={{ background: 'linear-gradient(135deg,#7c4dff,#448aff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AVL Visualizer
                </Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(124,77,255,0.15)' }} />

            {/* ── Bulk input ──────────────────────── */}
            <Typography className="sidebar-section-label">Bulk Insert</Typography>

            <TextField
                id="bulk-input"
                label="Enter integers"
                placeholder="e.g. 10, 20, 30, 5, 4"
                size="small"
                fullWidth
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onVisualize(inputText);
                }}
            />

            <Button
                id="btn-visualize"
                variant="contained"
                startIcon={<Play size={18} />}
                fullWidth
                onClick={() => onVisualize(inputText)}
                sx={{
                    background: 'linear-gradient(135deg,#7c4dff 0%,#448aff 100%)',
                    '&:hover': { background: 'linear-gradient(135deg,#651fff 0%,#2979ff 100%)' },
                }}
            >
                Visualize
            </Button>

            <Divider sx={{ borderColor: 'rgba(124,77,255,0.15)' }} />

            {/* ── Single insert ───────────────────── */}
            <Typography className="sidebar-section-label">Single Operations</Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    id="single-insert-input"
                    label="Key"
                    placeholder="42"
                    size="small"
                    value={singleKey}
                    onChange={(e) => setSingleKey(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onInsert(singleKey);
                            setSingleKey('');
                        }
                    }}
                    sx={{ flex: 1 }}
                />
                <Tooltip title="Insert">
                    <IconButton
                        id="btn-insert"
                        onClick={() => { onInsert(singleKey); setSingleKey(''); }}
                        sx={{
                            bgcolor: 'rgba(124,77,255,0.15)',
                            '&:hover': { bgcolor: 'rgba(124,77,255,0.3)' },
                            borderRadius: '10px',
                            width: 44,
                            height: 44,
                        }}
                    >
                        <Plus size={20} color="#b388ff" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    id="delete-input"
                    label="Delete key"
                    placeholder="42"
                    size="small"
                    value={deleteKey}
                    onChange={(e) => setDeleteKey(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onDelete(deleteKey);
                            setDeleteKey('');
                        }
                    }}
                    sx={{ flex: 1 }}
                />
                <Tooltip title="Delete">
                    <IconButton
                        id="btn-delete"
                        onClick={() => { onDelete(deleteKey); setDeleteKey(''); }}
                        sx={{
                            bgcolor: 'rgba(239,83,80,0.12)',
                            '&:hover': { bgcolor: 'rgba(239,83,80,0.25)' },
                            borderRadius: '10px',
                            width: 44,
                            height: 44,
                        }}
                    >
                        <Trash2 size={20} color="#ef5350" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Button
                id="btn-clear"
                variant="outlined"
                startIcon={<Eraser size={18} />}
                fullWidth
                onClick={onClear}
                sx={{
                    borderColor: 'rgba(239,83,80,0.4)',
                    color: '#ef5350',
                    '&:hover': { borderColor: '#ef5350', background: 'rgba(239,83,80,0.08)' },
                }}
            >
                Clear Tree
            </Button>

            <Divider sx={{ borderColor: 'rgba(124,77,255,0.15)' }} />

            {/* ── Speed slider ────────────────────── */}
            <Typography className="sidebar-section-label">
                <Gauge size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Animation Speed
            </Typography>

            <Box sx={{ px: 1 }}>
                <Slider
                    id="speed-slider"
                    value={speed}
                    onChange={(_, v) => onSpeedChange(v)}
                    min={100}
                    max={2000}
                    step={100}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(v) => `${v} ms`}
                    sx={{
                        color: '#7c4dff',
                        '& .MuiSlider-thumb': {
                            boxShadow: '0 0 8px rgba(124,77,255,0.5)',
                        },
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -0.5 }}>
                    <Typography variant="caption" color="text.secondary">Fast</Typography>
                    <Typography variant="caption" color="text.secondary">Slow</Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(124,77,255,0.15)' }} />

            {/* ── Step-by-step toggle ──────────────── */}
            <FormControlLabel
                control={
                    <Switch
                        id="step-mode-toggle"
                        checked={stepMode}
                        onChange={(e) => onStepModeChange(e.target.checked)}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c4dff' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7c4dff' },
                        }}
                    />
                }
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Footprints size={16} />
                        <Typography variant="body2">Step-by-Step</Typography>
                    </Box>
                }
            />

            {/* ── Legend ───────────────────────────── */}
            <Box sx={{ mt: 'auto', pt: 2 }}>
                <Typography className="sidebar-section-label" sx={{ mb: 1 }}>Balance Factor Legend</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {[
                        { color: '#66bb6a', label: 'BF = 0 (balanced)' },
                        { color: '#ffa726', label: 'BF = ±1' },
                        { color: '#ef5350', label: 'BF = ±2 (unbalanced)' },
                    ].map((item) => (
                        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                            <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
