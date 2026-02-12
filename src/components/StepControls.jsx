import React from 'react';
import { IconButton, Typography, Tooltip } from '@mui/material';
import {
    SkipBack,
    Play,
    Pause,
    SkipForward,
} from 'lucide-react';

export default function StepControls({
    stepIndex,
    totalSteps,
    isPlaying,
    onPrev,
    onNext,
    onPlayPause,
}) {
    return (
        <div className="step-bar">
            <Tooltip title="Previous step">
                <span>
                    <IconButton
                        id="btn-step-prev"
                        onClick={onPrev}
                        disabled={stepIndex <= 0}
                        size="small"
                        sx={{ color: '#b388ff' }}
                    >
                        <SkipBack size={18} />
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
                <IconButton
                    id="btn-step-play"
                    onClick={onPlayPause}
                    size="small"
                    sx={{
                        bgcolor: 'rgba(124,77,255,0.18)',
                        color: '#b388ff',
                        '&:hover': { bgcolor: 'rgba(124,77,255,0.3)' },
                    }}
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </IconButton>
            </Tooltip>

            <Tooltip title="Next step">
                <span>
                    <IconButton
                        id="btn-step-next"
                        onClick={onNext}
                        disabled={stepIndex >= totalSteps - 1}
                        size="small"
                        sx={{ color: '#b388ff' }}
                    >
                        <SkipForward size={18} />
                    </IconButton>
                </span>
            </Tooltip>

            <Typography
                variant="caption"
                sx={{ color: '#9fa8da', fontFamily: '"JetBrains Mono", monospace', ml: 1 }}
            >
                {stepIndex + 1} / {totalSteps}
            </Typography>
        </div>
    );
}
