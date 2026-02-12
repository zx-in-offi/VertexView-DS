import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#7c4dff',
            light: '#b47cff',
            dark: '#3f1dcb',
        },
        secondary: {
            main: '#448aff',
            light: '#83b9ff',
            dark: '#005ecb',
        },
        background: {
            default: '#0a0e1a',
            paper: '#121829',
        },
        text: {
            primary: '#e8eaf6',
            secondary: '#9fa8da',
        },
        success: { main: '#66bb6a' },
        warning: { main: '#ffa726' },
        error: { main: '#ef5350' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 20px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        fontFamily: '"JetBrains Mono", monospace',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: '1px solid rgba(124,77,255,0.15)',
                },
            },
        },
    },
});

export default theme;
