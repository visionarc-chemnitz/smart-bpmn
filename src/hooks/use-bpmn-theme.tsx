// hooks/use-bpmn-theme.tsx
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export const useBpmnTheme = (modeler: any) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (!modeler) return;

    const applyTheme = () => {
      const canvas = modeler.get('canvas');
      const container = canvas._container;
      
      if (!container) return;

      // Remove existing theme classes
      container.classList.remove('bpmn-theme-light', 'bpmn-theme-dark');
      
      // Add new theme class
      container.classList.add(`bpmn-theme-${theme}`);

      // Apply theme-specific styles
      const isDark = theme === 'dark';
      
      // Update CSS variables for dynamic theming
      container.style.setProperty('--bpmn-bg-color', isDark ? '#1e1e1e' : '#ffffff');
      container.style.setProperty('--bpmn-primary-color', isDark ? '#ffffff' : '#000000');
      container.style.setProperty('--bpmn-secondary-color', isDark ? '#2d2d2d' : '#f8f8f8');
      container.style.setProperty('--bpmn-border-color', isDark ? '#444444' : '#cccccc');

      // Refresh the diagram to apply changes
      canvas.zoom('fit-viewport', 'auto');
    };

    // Apply theme immediately
    applyTheme();

    // Add event listener for theme changes
    const onThemeChange = () => {
      applyTheme();
    };

    window.addEventListener('theme-change', onThemeChange);

    return () => {
      window.removeEventListener('theme-change', onThemeChange);
    };
  }, [modeler, theme]);
};